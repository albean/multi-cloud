import {
  Pipeline,
  Queue,
  Secret,
  Service,
  DockerRepository,
  PersistantStorage,
  DockerRepositoryPath,
  Image,
} from "infrastracture/resources";

export const Application = () => {
  const secret = Secret({ name: "smtp" })

  const repo = DockerRepository({ name: "app" })
  const backendRepoPath: DockerRepositoryPath = { repo, path: "backend" };
  const frontendRepoPath: DockerRepositoryPath = { repo, path: "frontend" };
  const backendServices: Service[] = [];

  const backendImage = Image({ repo: backendRepoPath, dir: "backend" })

  const storage = PersistantStorage({ name: "attachments" });

  const mailQueue = Queue({ name: "email" })
  const renderQueue = Queue({ name: "render" })

  const queuesEnv = [
    { name: "QUEUE_MAIL_ID", value: mailQueue.id },
    { name: "QUEUE_RENDER_ID", value: renderQueue.id },
  ];

  const queueConsumer = (name: string, queue: Queue, memory = 1) => {

    const consumer = Service({
      name: `backend-consume-${name}`,
      image: backendImage,
      secrets,
      command: ["consume", name],
      expose: false,
      env: queuesEnv,
      memory,
      mounts: [{ storage, path: "/var/attachments" }]
    });

    consumer.consume(queue)
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
    image: backendImage,
    secrets,
    env: queuesEnv,
    command: ["server"],
    expose: true,
  });

  backendServices.push(service)

  queueConsumer("mail", mailQueue);
  queueConsumer("render", renderQueue, 4);

  const pipeline = Pipeline({
    name: "backend",
    repo: backendRepoPath,
    dockerfile: "backend/Dockerfile",
    services: backendServices,
  })

  const frontendImage = Image({ repo: frontendRepoPath, dir: "frontend", args: {
    BACKEND_PREFIX: service.exposedUrl,
  }})

  const frontend = Service({
    name: "frontend",
    image: frontendImage,
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
