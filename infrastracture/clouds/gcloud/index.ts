#!/usr/bin/env ts-node

import { implement } from "infrastracture/common/Resource";
import * as infra from "infrastracture/resources";
import { ShellProvider } from ".gen/providers/shell/provider";
import { Script } from ".gen/providers/shell/script";
import * as gcloud from "./resources"
import { scope, app } from "infrastracture/clouds/gcloud/scope";
import { Application } from "infrastracture/application";
import { singletone } from "common/utils";
import { execSync } from 'child_process';

const commit: string = execSync('git rev-parse HEAD').toString().trim();

new ShellProvider(scope, "shell-provider", { enableParallelism: true });

const location = "europe-west1";
const project = process.env.GCLOUD_PROJECT_ID || "";
const projectNumber = process.env.GCLOUD_PROJECT_NUMBER || "";

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

gcloud.SqlDatabase("db", { name: "prod", instance: instance.id })

const email = `${projectNumber}-compute@developer.gserviceaccount.com`;
const member = `serviceAccount:${email}`;

gcloud.ProjectIamMember("binding-registry", { member, project, role: "roles/artifactregistry.writer" });
gcloud.ProjectIamMember("binding-storage", { member, project, role: "roles/storage.admin" });
gcloud.ProjectIamMember("binding-secrets", { member, project, role: "roles/secretmanager.secretAccessor" });

gcloud.ServiceAccountIamBinding("iam-biding", {
  serviceAccountId: `projects/${project}/serviceAccounts/${email}`,
  members: [member],
  role: "roles/iam.serviceAccountUser",
})


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

const Queue = implement(infra.Queue, (props): { topic: gcloud.PubsubTopic, id: string } => {
  const topic = gcloud.PubsubTopic(props.name, { name: `dev-${props.name}-topic`})

  return { topic, id: topic.name };
})

const Secret = implement(infra.Secret, (p): { prefix: string } => {
  return { prefix: p.name };
})

const SecretKey = implement(infra.SecretKey, (p): { id: string } => {
  const prf = Secret.getProps(p.secret).prefix

  const secret = gcloud.SecretManagerSecret(`${prf}-${p.key}-secret`, {
    secretId: `${prf}-${p.key}`,
    replication: { auto: {} }
  });

  return { id: secret.id };
})

const Service = implement(infra.Service, (p): { name: string, tfService: gcloud.CloudRun, exposedUrl: string } => {
  const secretsEnvs: any[] = [];

  p.secrets?.forEach(s => {
    const secret = SecretKey.getProps(s.secret);

    secretsEnvs.push({
      name: s.name,
      valueSource: { secretKeyRef: { secret: secret.id, version: 'latest' } },
    });
  })

  const name = `svc-${p.name}`;
  const memory = `${p.memory ?? 1}Gi`;

  const command = p.command ? ["bash", "/app/entry", ...p.command] : undefined;


  const service = gcloud.CloudRun(name, {
    name: `app-${p.name}`,
    location,
    ingress: "INGRESS_TRAFFIC_ALL",
    deletionProtection: false,
    template: {
      scaling: { maxInstanceCount: 1, minInstanceCount: 0 },
      containers: [{
        image: Image.getProps(p.image).tag,
        command: command,
        resources: { limits: {
          cpu: '1000m',
          memory,
        } },
        volumeMounts: [
          ...(p.mounts??[]).map(v => {
            const storage = Storage.getProps(v.storage);

            return { name: storage.id, mountPath: v.path };
          }),
          { name: "cloudsql", mountPath: '/cloudsql' },
        ],
        env: [
          { name: "VER", value: "v23" },

          { name: "QUEUE_BACKEND", value: "pubsub" },

          { name: "DB_HOST", value: instance.ipAddress.get(0).getStringAttribute("ip_address") },
          { name: "DB_NAME", value: "prod" },
          { name: "DB_USER", value: user.name },
          { name: "DB_PASS", value: user.password },
          ...secretsEnvs,
          ...(p.env ?? []),
        ],
      }],
      volumes: [
        ...(p.mounts??[]).map(v => {
          const storage = Storage.getProps(v.storage);
          return { name: storage.id, gcs: { bucket: storage.name } }
        }),
        { name: "cloudsql", cloudSqlInstance: { instances: [ instance.connectionName ] } },
      ]
    }
  });

  if (p.expose) {
    gcloud.CloudRunServiceIamBinding(`all-member-${p.command}`, {
      location: service.location,
      service: service.name,
      role: "roles/run.invoker",
      members: [ "allUsers" ]
    })
  }

  return { tfService: service, name, exposedUrl: service.uri };
})

implement(infra.QueueConsumer, (p): {} => {
  const topic = Queue.getProps(p.queue).topic
  const service = Service.getProps(p.service)

  gcloud.CloudRunServiceIamBinding(`pubsub-service-${service.name}-binding`, {
    location: service.tfService.location,
    service: service.tfService.name,
    role: "roles/run.invoker",
    members: [ `serviceAccount:${pubSubSa().email}` ]
  });

  gcloud.PubsubSubscription(`${service.name}-subscption`, {
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

const DockerRepository = implement(infra.DockerRepository, (p): { url: string } => {
  const dockerRepo = gcloud.ArtifactRegistryRepository(`repository-${p.name}`, {
    format: "docker",
    repositoryId: p.name,
  })
  return {
    url: `${dockerRepo.location}-docker.pkg.dev/${project}/${dockerRepo.name}/`
  };
})

const Storage = implement(infra.PersistantStorage, (p): { id: string, name: string } => {
  const storage = gcloud.StorageBucket(p.name, {
    name: `multi-cloud-${p.name}-n2lj3`,
    location,
  });

  return { id: p.name, name: storage.name };
})

const Image = implement(infra.Image, (p): { tag: string } => {
  const imageTag = `${DockerRepository.getProps(p.repo.repo).url}${p.repo.path}`;

  const args = p.args ?
    Object.entries(p.args).map(([k,v]) => `--build-arg "${k}=${v}"`).join(" ")
  : "";

  const image = new Script(scope, "build_" + p.dir, {
    lifecycleCommands: {
      create: `${process.cwd()}/bin/script/build.sh`,
      delete: `${process.cwd()}/bin/script/nop.sh`,
    },
    environment: {
      _VERSION: commit,
      CWD: process.cwd(),
      DIR: p.dir,
      REPO_URL: imageTag,
      ARGS: args
    }
  });

  return { tag: `\${${image.fqn}.output.tag}` };
})

Application()

app.synth();
