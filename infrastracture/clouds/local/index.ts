import * as infra from "infrastracture/resources";
import { implement } from "infrastracture/common/Resource";
import { Application } from "infrastracture/application";
import * as crypto from 'crypto';
import { run } from "common/utils";
import { writeFileSync } from "fs";

const hash = (input: string): number => {
  const hash = crypto.createHash('sha256').update(input).digest('hex');
  const intHash = parseInt(hash.slice(0, 8), 16);
  return intHash % 101;
};

const compose: any = { services: {}, volumes: {}, networks: {} }

interface ComposeService {
  image?: string,
  build?: string | { context?: string, dockerfile: string, args?: {} },
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
  compose.services[id] = service
}

compose.networks.backend = { driver: "bridge" }

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

ComposeService("postgres", {
  image: "postgres:latest",
  networks: ["backend"],
  environment: {
    POSTGRES_USER: "user",
    POSTGRES_PASSWORD: "password",
    POSTGRES_DB: "mydb"
  },
  ports: ["5532:5432"],
})

implement(infra.Service, (p): { exposedUrl: string, version: string, id: string } => {
  const port = 8100 + hash(p.name);
  const ports = p.expose ? [`${port}:8080`] : [];
  const id = p.name.replace(/\-/g, "_");
  const dir = p.image.props.dir;
  const args = p.image.props.args;

  ComposeService(id, {
    restart: 'on-failure',
    build: {
      context: ".",
      dockerfile: `${dir}/Dockerfile`,
      args,
    },
    networks: ["backend"],
    environment: {
      VER: "v1",
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
    version: `0`,
    id,
  };
})

const Storage = implement(infra.PersistantStorage, (p): { name: string } => {
  const name = `${p.name}`

  compose.volumes[name] = {}

  return { name: name };
})

Application()

writeFileSync('build/docker-compose.yml', JSON.stringify(compose, null, 2))

const args = process.argv.filter(_ => _.startsWith("-"));

run([
  'docker', 'compose', '-p', 'multi_app',
  '-f', 'build/docker-compose.yml',
  '--project-directory', process.cwd(),
  'up', '-d', '--build', ...args
]).catch(console.error);
