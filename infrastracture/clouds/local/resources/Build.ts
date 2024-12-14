import { hash, run } from "common/utils";
import { Build, Container } from "infrastracture/resources";
import { implement } from "infrastracture/common/Resource";

export const BuildImpl = implement(Build, async (p): Promise<{ imageId: string }> => {
  const imageId = `backend-${hash()}`

  await run(["docker", "build", "-t", imageId, p.path])

  return { imageId };
})


