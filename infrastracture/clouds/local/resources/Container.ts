import { implement } from "infrastracture/common/Resource";
import { Container } from "infrastracture/resources";
import { $ } from "infrastracture/clouds/local";
import { run } from "common/utils";

export const ContainerImpl = implement(
  Container,
  async (p): Promise<{}>  => {
    const name = "backend";
    const build = await $(p.build);

    await run(["docker", "rm", "-f", name])

    // const cmd = ["docker", "run", "-p", "80:80", "--name", name, "-d", build.imageId];

    // await run(cmd)

    return {};
  }
);
