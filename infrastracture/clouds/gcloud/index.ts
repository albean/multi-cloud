import { digest, implement } from "infrastracture/common/Resource";
import {
  Service,
  Secret,
  Queue,
  QueueType,
  SecretType,
  SecretKeyType,
  SecretKey,
  QueueConsumer,
  ServiceType,
  Pipeline,
  PipelineType,
} from "infrastracture/resources";
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
import { Application } from "infrastracture/application";
import { singletone } from "common/utils";

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
    ipConfiguration: {
      authorizedNetworks: [{
        name: "unsafe-all-tf",
        value: "0.0.0.0/0"
      }]
    }
  },
});

const user = gcloud.SqlUser("db-user", {
  instance: instance.id,
  name: "app",
  password: "Tzh-RTPe-C9fkLmAHwxhb3hyU!e@u4"
})


const database = gcloud.SqlDatabase("db", { name: "prod", instance: instance.id })

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

const image = `${dockerRepo.location}-docker.pkg.dev/${project}/${dockerRepo.name}/main`;
const tag = `${dockerRepo.location}-docker.pkg.dev/${project}/${dockerRepo.name}/main:ts-0104`;

gcloud.Out("image", { value: image })


// gcloud.Out("service-url", { value: service.uri })

const pubSubSa = singletone(() => {
  const sa = gcloud.ServiceAccount("pubsub-service-account", {
    displayName: "Cloud Run Pub/Sub Invoker",
    accountId: `cloud-run-pubsub-invoker`
  })

  gcloud.ProjectIamMember("pubsub-member", {
    project,
    role: "roles/run.invoker",
    member: `serviceAccount:${sa.email}`,
  })

  return sa;
});

const QueueImpementation = implement(Queue, (props): { topic: gcloud.PubsubTopic } => {
  const topic = gcloud.PubsubTopic(props.name, { name: `dev-${props.name}-topic`})

  return { topic };
})

const SecretImplementation = implement(Secret, (p): { prefix: string } => {
  return { prefix: p.name };
})

const SecretKeyImplementation = implement(SecretKey, (p): { id: string } => {
  const prf = $gcloud(p.secret).prefix

  const secret = gcloud.SecretManagerSecret(`${prf}-${p.key}-secret`, {
    secretId: `${prf}-${p.key}`,
    replication: { auto: {} }
  });

  return { id: secret.id };
})

const PipelineImplementation = implement(Pipeline, (p): {  } => {
  gcloud.CloudBuildTrigger("pipeline", {
    name: "backend-build",
    location,
    repositoryEventConfig: {
      repository: repo.id,
      push: { branch: "main" }
    },
    buildAttribute: {
      step: [
        // {
        //   name: "gcr.io/cloud-builders/docker",
        //   script: [
        //     "docker build --platform linux/amd64 --progress plain -t backend -f backend/Dockerfile .",
        //     "echo 'Building...'",
        //     `export TAG="$(date +%y%m%d)-$(openssl rand -hex 16 | head -c 10)"`,
        //     "echo $REPO:$TAG",
        //     "docker tag backend $REPO:$TAG",
        //     "docker push $REPO:$TAG",
        //     "echo $REPO:$TAG > image.txt",
        //   ].join(";\n"),
        //   env: [
        //     `REPO=${image}`,
        //   ]
        // },
        {
          name: "gcr.io/google.com/cloudsdktool/cloud-sdk",
          script: [
            `ls -la`,
            // @FIXME image
            // `export IMAGE=$(cat image.txt)`,
            `export IMAGE="europe-central2-docker.pkg.dev/ultimate-life-396919/backend/main:250222-71ae64ecef"`,
            `echo "Deploying location $IMAGE"`,
            p.services.map(_ => $gcloud(_)).flatMap(s => [
              `echo 'gcloud run deploy ${s.tfService.name} --image $IMAGE --region ${location}'`,
              `gcloud run deploy ${s.tfService.name} --image $IMAGE --region ${location}`,
            ]),
          ].join(";\n"),
        },
      ],
    },
  });
  return {};
})

const ServiceImplementation = implement(Service, (p): { name: string, tfService: gcloud.CloudRun } => {
  const secretsEnvs: any[] = [];

  p.secrets?.forEach(s => {
    const secret = $gcloud(s.secret);

    secretsEnvs.push({
      name: s.name,
      valueSource: { secretKeyRef: { secret: secret.id, version: 'latest' } },
    });
  })

  const name = `backend-svc-${p.command}`;
  const memory = `${p.memory ?? 1}Gi`;

  const service = gcloud.CloudRun(name, {
    name: `tf-app-${p.command}`,
    location,
    ingress: "INGRESS_TRAFFIC_ALL",
    deletionProtection: false,
    template: {
      scaling: { maxInstanceCount: 1, minInstanceCount: 0 },
      containers: [{
        image: tag,
        resources: { limits: {
          cpu: '1000m',
          memory,
        } },
        volumeMounts: [{ name: "cloudsql", mountPath: '/cloudsql' }],
        command: ["bash", "/app/entry", p.command],
        env: [
          { name: "VER", value: "v23" },

          { name: "QUEUE_BACKEND", value: "pubsub" },
          { name: "QUEUE_MAIL_ID", value: "dev-mail-topic" },

          { name: "DB_HOST", value: instance.ipAddress.get(0).getStringAttribute("ip_address") },
          { name: "DB_NAME", value: "prod" },
          { name: "DB_USER", value: user.name },
          { name: "DB_PASS", value: user.password },
          ...secretsEnvs,
        ],
      }],
      volumes: [{
        name: "cloudsql",
        cloudSqlInstance: {
          instances: [instance.connectionName],
        }
      }]
    }
  });

  if (p.expose) {
    gcloud.CloudRunServiceIamBinding("all-members", {
      location: service.location,
      service: service.name,
      role: "roles/run.invoker",
      members: [ "allUsers" ]
    })
  }

  return { tfService: service, name };
})

const QueueConsumerImplementation = implement(QueueConsumer, (p): {} => {
  const topic = $gcloud(p.queue).topic
  const service = $gcloud(p.service)

  gcloud.CloudRunServiceIamBinding(`pubsub-service-${service.name}-binding`, {
    location: service.tfService.location,
    service: service.tfService.name,
    role: "roles/run.invoker",
    members: [ `serviceAccount:${pubSubSa().email}` ]
  });

  const sub = gcloud.PubsubSubscription(`${service.name}-subscption`, {
    name: `${service.name}-subscption`,
    topic: topic.id,
    ackDeadlineSeconds: 10 * 60,
    pushConfig: {
      pushEndpoint: service.tfService.uri,
      oidcToken: { serviceAccountEmail: pubSubSa().email },
    }
  })

  return {};
})

export const $gcloud = digest({
  [QueueType]: QueueImpementation,
  [SecretType]: SecretImplementation,
  [SecretKeyType]: SecretKeyImplementation,
  [PipelineType]: PipelineImplementation,
  [ServiceType]: ServiceImplementation,

  // @FIXME Should be checked!
  [""]: QueueImpementation,
})

Application()

app.synth();
