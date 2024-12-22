import { digest } from "infrastracture/common/Resource";
import { Build, BuildType, ContainerType } from "infrastracture/resources";
import { ShellProvider } from ".gen/providers/shell/provider";
import { Script } from ".gen/providers/shell/script";
import { App, TerraformStack } from "cdktf";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { CloudRunV2Service } from "@cdktf/provider-google/lib/cloud-run-v2-service";
import { CloudRunServiceIamBinding } from "@cdktf/provider-google/lib/cloud-run-service-iam-binding";
import { LocalBackend } from 'cdktf';

export const app = new App();

export const scope = new TerraformStack(app, "app");

new GoogleProvider(scope, 'GoogleProvider', {
  project: 'ultimate-life-396919',
  region: 'europe-central2',
});

new LocalBackend(scope, { path: 'terraform.tfstate' });
