import {
  Pipeline,
  Queue,
  Secret,
  Service,
  DockerRepository,
  DockerRepositoryPath,
} from "infrastracture/resources";

export const Application = () => {
  const secret = Secret({ name: "smtp" })

  const repo = DockerRepository({ name: "app" })
  const backendRepoPath: DockerRepositoryPath = { repo, path: "backend" };
  const frontendRepoPath: DockerRepositoryPath = { repo, path: "frontend" };

  const mailQueue = Queue({ name: "mail" })

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
    command: "server",
    expose: true,
  });

  const consumer = Service({
    name: "backend-consume",
    repo: backendRepoPath,
    secrets,
    command: "consume",
    expose: false,
    memory: 4,
  });

  consumer.consume(mailQueue)

  const pipeline = Pipeline({
    repo: backendRepoPath,
    dockerfile: "backend/Dockerfile",
    services: [service, consumer],
  })

  const frontend = Service({
    name: "frontend",
    repo: frontendRepoPath,
    expose: true,
    env: [
      { name: "SERVER_URL", value: service.exposedUrl }
    ]
  });

  Pipeline({
    repo: frontendRepoPath,
    dockerfile: "fronetnd/Dockerfile",
    services: [frontend],
  })


  // Backend(props.domain)
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
