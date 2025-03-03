import { digest, implement } from "infrastracture/common/Resource";
// import { BuildImpl } from "./resources/Build";
// import { ContainerImpl } from "./resources/Container";
import { ShellProvider } from ".gen/providers/shell/provider";
import { Script } from ".gen/providers/shell/script";
import * as res from "infrastracture/resources";
import { App, ITerraformDependable, TerraformStack } from "cdktf";
import { LocalBackend } from 'cdktf';
import { Application } from "infrastracture/application";
import * as crypto from 'crypto';
import { Construct } from "constructs";

const app = new App();
const scope = new TerraformStack(app, "app");

const hash = (input: string): number => {
  const hash = crypto.createHash('sha256').update(input).digest('hex');
  const intHash = parseInt(hash.slice(0, 8), 16);
  return intHash % 101;
};

const yamlResources: ITerraformDependable[] = []

new ShellProvider(scope, "shell-provider", {
  enableParallelism: true,
});

new LocalBackend(scope, {
  path: 'cdktf.out/state/terraform.tfstate'
});

const resource = <T>(id: string, command: string, env: Record<string, string>) => {
  const constr = new Script(scope, id, {
    lifecycleCommands: {
      create: `${process.cwd()}/bin/script/create.sh`,
      delete: `${process.cwd()}/bin/script/delete.sh`,
    },
    environment: {
      // _VERSION: `${Math.random()}`,
      CWD: process.cwd(),
      COMMAND: command,
      ...env,
    }
  });

  return constr;
}

interface ComposeService {
  image?: string,
  build?: string | { context?: string, dockerfile: string },
  restart?: "on-failure" | "always",
  ports?: string[],
  networks?: string[],
  command?: string[] | string,
  volumes?: string[],
  container_name?: string,
  depends_on?: string[],
  environment?: Record<string, string>,
  env_file?: string,
}

const ComposeService = (id: string, service: ComposeService) => {
  const res = resource(`services-${id}`, "update_compose", {
    PATCH: JSON.stringify(service),
    JPATH: `services.${id}`,
  });

  yamlResources.push(res);

  return { version: `\${${res.fqn}.output.version}` };
}

const patch = (path: string, patch: any) => {
  return resource(`patch-${path.replace(/[^a-z0-9]+/g, "-")}`, "update_compose", {
    PATCH: JSON.stringify(patch),
    JPATH: path,
  });
}

patch("networks.backend", { driver: "bridge" })

ComposeService("redis", {
  image: 'redis:latest',
  networks: ["backend"],
  ports: ['6379:6379']
})

ComposeService("mailcatcher", {
  networks: ["backend"],
  restart: 'on-failure',
  image: 'dockage/mailcatcher:0.9.0',
  ports: [
    '1080:1080',
    '1025:1025'
  ]
})

const backend = ComposeService("postgres", {
  image: "postgres:latest",
  networks: ["backend"],
  environment: {
    POSTGRES_USER: "user",
    POSTGRES_PASSWORD: "password",
    POSTGRES_DB: "mydb"
  },
  ports: [
    "5532:5432"
  ]
})

let lastPort = 8100;

const ServiceImpl = implement(res.Service, (p): { exposedUrl: string, version: string, id: string } => {
  const port = 8100 + hash(p.name);
  const ports = p.expose ? [`${port}:8080`] : [];
  const id = p.name.replace(/\-/g, "_");

  const res = ComposeService(id, {
    env_file: "build/.env",
    restart: 'on-failure',
    build: {
      context: ".",
      dockerfile: `${p.name}/Dockerfile`
    },
    networks: ["backend"],
    environment: {
      DB_HOST: "postgres",
      DB_NAME: "postgres",
      DB_USER: "user",
      DB_PASS: "password",

      SMTP_HOST: "mailcatcher",
      SMTP_PORT: "1025",
      SMTP_PASS: "",
      SMTP_USER: "",

      QUEUE_BACKEND: "redis",
      QUEUE_HOST: "redis",
      // QUEUE_MAIL_ID: "dev-mail-topic",
    },
    ports,
    command: p.command,
    volumes: p.mounts?.map(m => {
      const st = $local(m.storage).name;

      return `${st}:${m.path}`;
    }) ?? []
  });

  return {
    exposedUrl: `http://localhost:${port}`,
    version: res.version,
    id,
  };
})

implement(res.Pipeline, (p): {} => {
  p.services.map(s => {
    const id = $local(s).id;
    const version = $local(s).version;
    patch(`services.${id}.build`, {
      dockerfile: p.dockerfile,
      context: ".",
      args: {
        ...p.args,
        VERSION: version,
      }
    });
  })
  return {};
})

const PersistantStorageImpl = implement(res.PersistantStorage, (p): { name: string } => {
  const name = `${p.name}_v3`
  patch(`volumes.${name}`, {});

  return { name: name };
})

const $local = digest({
  [res.ServiceType]: ServiceImpl,
  [res.PersistantStorageType]: PersistantStorageImpl,
});

Application()

setTimeout(() => {
  new Script(scope, "compose-up", {
    dependsOn: yamlResources,
    lifecycleCommands: {
      create: `${process.cwd()}/bin/script/create.sh`,
      delete: `${process.cwd()}/bin/script/delete.sh`,
    },
    environment: {
      CWD: process.cwd(),
      COMMAND: "dc_up",
      VERSION: "v1",
    }
  });
  app.synth();
})
