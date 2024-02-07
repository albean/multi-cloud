import { implement } from "infrastracture/common/Resource";
import { Container } from "../../app/Constructs";
import { $ } from "../Development";
import { run } from "common/utils";

export const ContainerImpl = implement(
  Container,
  async (p): Promise<{}>  => {
    const build = await $(p.build);
    const name = "backend";

    await run(["docker", "rm", "-f", name])

    const cmd = ["docker", "run", "-p", "80:80", "--name", name, "-d", build.imageId];

    await run(cmd)

    return {};
  }
);
