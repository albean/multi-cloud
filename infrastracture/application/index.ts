import { Build, Container } from "infrastracture/resources";

export const Application = (props: Props) => {
  Backend(props.domain)
}

const Backend = (domain: string) => {
  const build = Build({ path: `backend` });

  const container = Container({ build });

  console.log({ container })

  container.expose(`api.${domain}`);
};

interface Props { domain: string }
