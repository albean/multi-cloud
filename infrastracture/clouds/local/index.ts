import { digest } from "infrastracture/common/Resource";
import { BuildImpl } from "./resources/Build";
import { ContainerImpl } from "./resources/Container";
import { Build, BuildType, ContainerType } from "infrastracture/resources";
import { ShellProvider } from ".gen/providers/shell/provider";
import { Script } from ".gen/providers/shell/script";
import { App, TerraformStack } from "cdktf";

export const $ = digest({
  [BuildType]: BuildImpl,
  [ContainerType]: ContainerImpl,
})

const app = new App();
const scope = new TerraformStack(app, "app");

new ShellProvider(scope, "shell-provider", {});

// new Script(scope, "docker", {
//   lifecycleCommands: {
//     create: `${process.cwd()}/bin/script/create.sh`,
//     delete: `${process.cwd()}/bin/script/delete.sh`,
//   },
//   environment: {
//     _VERSION: 'v2'
//   }
// });

app.synth();
