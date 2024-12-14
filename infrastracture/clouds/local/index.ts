import { digest } from "infrastracture/common/Resource";
import { BuildImpl } from "./resources/Build";
import { ContainerImpl } from "./resources/Container";
import { Build, BuildType, ContainerType } from "infrastracture/resources";

export const $ = digest({
  [BuildType]: BuildImpl,
  [ContainerType]: ContainerImpl,
})
