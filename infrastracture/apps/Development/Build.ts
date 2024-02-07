import { hash, run } from "common/utils";
import { Build, Container } from "../../app/Constructs";
import { implement } from "../../common/Resource";

export const BuildImpl = implement(Build, async (p): Promise<{ imageId: string }> => {
  const imageId = `backend-${hash()}`

  await run(["docker", "build", "-t", imageId, p.path])

  return { imageId };
})


