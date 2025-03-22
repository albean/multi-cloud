import * as infra from "infrastracture/resources";
import { implement } from "infrastracture/common/Resource";
import { ShellProvider } from ".gen/providers/shell/provider";
import { Script } from ".gen/providers/shell/script";
import { App, TerraformStack } from "cdktf";
import { LocalBackend } from 'cdktf';
import { Application } from "infrastracture/application";
import * as crypto from 'crypto';

const app = new App();
const scope = new TerraformStack(app, "app");

const hash = (input: string): number => {
  const hash = crypto.createHash('sha256').update(input).digest('hex');
  const intHash = parseInt(hash.slice(0, 8), 16);
  return intHash % 101;
};

const yamlResources: Script[] = []

new ShellProvider(scope, "shell-provider", { enableParallelism: true });

new LocalBackend(scope, { path: 'cdktf.out/state/terraform.tfstate' });

const resource = <T>(id: string, command: string, env: Record<string, string>) => {
  const constr = new Script(scope, id, {
    lifecycleCommands: {
      create: `${process.cwd()}/bin/script/create.sh`,
      delete: `${process.cwd()}/bin/script/delete.sh`,
    },
    environment: {
      _VERSION: `v1`,
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
  const res = resource(`patch-${path.replace(/[^a-z0-9]+/g, "-")}`, "update_compose", {
    PATCH: JSON.stringify(patch),
    JPATH: path,
  });

  yamlResources.push(res)

  return res;
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

implement(infra.Service, (p): { exposedUrl: string, version: string, id: string } => {
  const port = 8100 + hash(p.name);
  const ports = p.expose ? [`${port}:8080`] : [];
  const id = p.name.replace(/\-/g, "_");

  const res = ComposeService(id, {
    // env_file: "build/.env",
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
      QUEUE_MAIL_ID: "dev-mail-topic",
    },
    ports,
    command: p.command,
    volumes: p.mounts?.map(m => {
      const st = Storage.getProps(m.storage).name;

      return `${st}:${m.path}`;
    }) ?? []
  });

  return {
    exposedUrl: `http://localhost:${port}`,
    version: res.version,
    id,
  };
})

const Storage = implement(infra.PersistantStorage, (p): { name: string } => {
  const name = `${p.name}`
  patch(`volumes.${name}`, {});

  return { name: name };
})

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
      VER: `${Math.random()}`,
      VERSION: yamlResources.map(_ => _.output.lookup("version")).join(","),
    }
  });
  app.synth();
})
