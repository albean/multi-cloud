import { App, TerraformStack } from "cdktf";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { LocalBackend } from 'cdktf';

export const app = new App();

export const scope = new TerraformStack(app, "app");

const project = process.env.GCLOUD_PROJECT_ID || "";

new GoogleProvider(scope, 'GoogleProvider', {
  project: project,
  region: 'europe-central2',
});

new LocalBackend(scope, { path: 'terraform.tfstate' });
