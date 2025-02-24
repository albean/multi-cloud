import {
  Pipeline,
  Queue,
  Secret,
  Service,
  DockerRepository,
  PersistantStorage,
  DockerRepositoryPath,
} from "infrastracture/resources";

export const Application = () => {
  const secret = Secret({ name: "smtp" })

  const repo = DockerRepository({ name: "app" })
  const backendRepoPath: DockerRepositoryPath = { repo, path: "backend" };
  const frontendRepoPath: DockerRepositoryPath = { repo, path: "frontend" };
  const backendServices: Service[] = [];

  const storage = PersistantStorage({ name: "attachments" });

  const queueConsumer = (name: string, memory = 1) => {
    const mailQueue = Queue({ name })

    const consumer = Service({
      name: `backend-consume-${name}`,
      repo: backendRepoPath,
      secrets,
      command: ["consume", name],
      expose: false,
      memory,
      mounts: [{ storage, path: "/var/attachments" }]
    });

    consumer.consume(mailQueue)
    backendServices.push(consumer);

    return consumer;
  }

  const secrets = [
    { name: "SMTP_HOST", secret: secret.key("host") },
    { name: "SMTP_PORT", secret: secret.key("port") },
    { name: "SMTP_USER", secret: secret.key("user") },
    { name: "SMTP_PASS", secret: secret.key("pass") },
  ];

  const service = Service({
    name: "backend-server",
    repo: backendRepoPath,
    secrets,
    command: ["server"],
    expose: true,
  });

  backendServices.push(service)

  queueConsumer("mail");
  queueConsumer("render", 4);

  const pipeline = Pipeline({
    name: "backend",
    repo: backendRepoPath,
    dockerfile: "backend/Dockerfile",
    services: backendServices,
  })

  const frontend = Service({
    name: "frontend",
    repo: frontendRepoPath,
    expose: true,
  });

  Pipeline({
    name: "frontend",
    repo: frontendRepoPath,
    dockerfile: "frontend/Dockerfile",
    services: [frontend],
    args: { BACKEND_PREFIX: service.exposedUrl }
  })
}

// const Backend = (domain: string) => {
//   const build = Build({ path: `backend` });
//
//   const container = Container({ build });
//
//   console.log({ container })
//
//   container.expose(`api.${domain}`);
// };

interface Props { domain: string }
