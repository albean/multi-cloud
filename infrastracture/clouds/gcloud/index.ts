import { digest } from "infrastracture/common/Resource";
import { Build, BuildType, ContainerType } from "infrastracture/resources";
import { ShellProvider } from ".gen/providers/shell/provider";
import { Script } from ".gen/providers/shell/script";
import { App, TerraformStack } from "cdktf";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { CloudRunV2Service } from "@cdktf/provider-google/lib/cloud-run-v2-service";
import { CloudbuildTrigger } from "@cdktf/provider-google/lib/cloudbuild-trigger";
import { Cloudbuildv2Repository } from "@cdktf/provider-google/lib/cloudbuildv2-repository";
import * as gcloud from "./resources"
import * as tf from "cdktf"
import { CloudRunServiceIamBinding } from "@cdktf/provider-google/lib/cloud-run-service-iam-binding";
import { LocalBackend } from 'cdktf';
import { scope, app } from "infrastracture/clouds/gcloud/scope";

type Constructor<T, Args extends any[]> = new (scope: any, ...args: Args) => T;

const tfResourceToFunc = <T, Args extends any[]>(Klass: Constructor<T, Args>): ((...args: Args) => T) =>
  (...args: Args) => new Klass(scope, ...args);

const location = "europe-west1";
const project = "ultimate-life-396919";
const projectNumber = "1087863064045";

const repo = gcloud.CloudBuildRepository("repo", {
  name: "mcloud",
  location,
  parentConnection: "projects/ultimate-life-396919/locations/europe-west1/connections/gh",
  remoteUri: `https://github.com/albean/multi-cloud.git`
})

const instance = gcloud.SqlDatabaseInstance("db-instance", {
  name: "main",
  region: location,
  databaseVersion: "POSTGRES_15",
  settings: {
    tier: "db-f1-micro",
  }
})

const user = gcloud.SqlUser("db-user", {
  instance: instance.id,
  name: "app",
  password: "Tzh-RTPe-C9fkLmAHwxhb3hyU!e@u4"
})
user.password

// const secret = gcloud.SecretManagerSecret("password", {
//   secretId: "app",
//   replication: {}
// });

const database = gcloud.SqlDatabase("db", {
  name: "prod",
  instance: instance.id,
})

instance.dnsName

const email = `${projectNumber}-compute@developer.gserviceaccount.com`;
const member = `serviceAccount:${email}`;

const cloudbuildEmail = `${projectNumber}@cloudbuild.gserviceaccount.com`
const memberCloudbuild = `serviceAccount:${cloudbuildEmail}`;

gcloud.ProjectIamMember("binding-registry", { member, project, role: "roles/artifactregistry.writer" });
gcloud.ProjectIamMember("binding-storage", { member, project, role: "roles/storage.admin" });

gcloud.ProjectIamMember("binding-run", {
  member: memberCloudbuild,
  project,
  role: "roles/run.developer",
});

gcloud.ServiceAccountIamBinding("iam-biding", {
  serviceAccountId: `projects/${project}/serviceAccounts/${email}`,
  members: [member],
  role: "roles/iam.serviceAccountUser",
})

const dockerRepo = gcloud.ArtifactRegistryRepository("repository", {
  format: "docker",
  repositoryId: "backend",
})
const image = `${dockerRepo.location}-docker.pkg.dev/${project}/${dockerRepo.name}/main:ts-0104`;

gcloud.Out("image", { value: image })

const service = gcloud.CloudRun('backend-svc', {
  name: "todo-all",
  location,
  ingress: "INGRESS_TRAFFIC_ALL",
  deletionProtection: false,
  template: {
    scaling: { maxInstanceCount: 1, minInstanceCount: 0 },
    containers: [{
      image: image,
      volumeMounts: [{ name: "cloudsql", mountPath: '/cloudsql' }],
    }],
    volumes: [{
      name: "cloudsql",
      cloudSqlInstance: {
        instances: [instance.connectionName],
      }
    }]
  }
});

gcloud.CloudRunServiceIamBinding("all-members", {
  location: service.location,
  service: service.name,
  role: "roles/run.invoker",
  members: [ "allUsers" ]
})


gcloud.CloudBuildTrigger("trigger", {
  name: "backend-build",
  location,
  repositoryEventConfig: {
    repository: repo.id,
    push: { branch: "main" }
  },
  buildAttribute: {
    step: [
      {
        name: "gcr.io/cloud-builders/docker",
        script: [
          "docker build -t backend backend",
          "echo 'Building...'",
          "echo $REPO:latest",
          "docker tag backend $REPO:latest",
          "docker push $REPO:latest",
        ].join(";\n"),
        env: [
          `REPO=${image}`,
        ]
      },
      {
        name: "gcr.io/google.com/cloudsdktool/cloud-sdk",
        entrypoint: "gcloud",
        args: [
          'run',
          'deploy',
          service.name,
          '--image',
          // `us-docker.pkg.dev/cloudrun/container/hello`,
          `${image}:latest`,
          '--region',
          location,
        ]
      }
    ],
  },
});



app.synth();
