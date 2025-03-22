import * as infra from "infrastracture/resources";

export const Application = () => {
  const secret = new infra.Secret({ name: "smtp" })
  const repo = new infra.DockerRepository({ name: "app" })

  const backendRepoPath: infra.DockerRepositoryPath = { repo, path: "backend" };
  const frontendRepoPath: infra.DockerRepositoryPath = { repo, path: "frontend" };

  const backendImage = new infra.Image({ repo: backendRepoPath, dir: "backend" })

  const storage = new infra.PersistantStorage({ name: "attachments" });

  const mailQueue = new infra.Queue({ name: "email" })
  const renderQueue = new infra.Queue({ name: "render" })

  const queuesEnv = [
    { name: "QUEUE_MAIL_ID", value: mailQueue.id },
    { name: "QUEUE_RENDER_ID", value: renderQueue.id },
  ];

  const queueConsumer = (name: string, queue: infra.Queue, memory = 1) => {
    const consumer = new infra.Service({
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

    return consumer;
  }

  const secrets = [
    { name: "SMTP_HOST", secret: secret.key("host") },
    { name: "SMTP_PORT", secret: secret.key("port") },
    { name: "SMTP_USER", secret: secret.key("user") },
    { name: "SMTP_PASS", secret: secret.key("pass") },
  ];

  const service = new infra.Service({
    name: "backend-server",
    image: backendImage,
    secrets,
    env: queuesEnv,
    command: ["server"],
    expose: true,
  });

  queueConsumer("mail", mailQueue);
  queueConsumer("render", renderQueue, 4);

  const frontendImage = new infra.Image({
    repo: frontendRepoPath,
    dir: "frontend",
    args: {
      BACKEND_PREFIX: service.exposedUrl,
    },
  })

  new infra.Service({
    name: "frontend",
    image: frontendImage,
    expose: true,
  });
}
