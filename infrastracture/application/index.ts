import { Queue, Secret, Service  } from "infrastracture/resources";

export const Application = () => {
  const secret = Secret({ name: "smtp" })

  const mailQueue = Queue({ name: "mail" })

  const secrets = [
    { name: "SMTP_HOST", secret: secret.key("host") },
    { name: "SMTP_PORT", secret: secret.key("port") },
    { name: "SMTP_USER", secret: secret.key("user") },
    { name: "SMTP_PASS", secret: secret.key("pass") },
  ];

  const service = Service({
    secrets,
    command: "server",
    expose: true,
  })

  const consumer = Service({
    secrets,
    command: "consume",
    expose: false,
    memory: 4,
  })

  consumer.consume(mailQueue)

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
