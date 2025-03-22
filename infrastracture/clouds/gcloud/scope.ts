import { App, TerraformStack } from "cdktf";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { LocalBackend } from 'cdktf';

export const app = new App();

export const scope = new TerraformStack(app, "app");

new GoogleProvider(scope, 'GoogleProvider', {
  project: 'ultimate-life-396919',
  region: 'europe-central2',
});

new LocalBackend(scope, { path: 'terraform.tfstate' });
