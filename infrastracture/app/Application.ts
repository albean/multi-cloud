import { Build, Container } from "./Constructs";

export const Application = (props: Props) => {
  const build = Build({ path: `backend` });

  const container = Container({ build });

  // container.expose(`api.${props.domain}`);
}

interface Props { domain: string }
