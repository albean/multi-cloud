import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { CloudRunV2Service } from "@cdktf/provider-google/lib/cloud-run-v2-service";
import { CloudRunServiceIamBinding } from "@cdktf/provider-google/lib/cloud-run-service-iam-binding";

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new GoogleProvider(this, 'GoogleProvider', {
      project: 'ultimate-life-396919',
      region: 'us-central1',
    });

    const service = new CloudRunV2Service(this, 'CloudRunExample', {
      name: "todo-all",
      location: "us-central1",
      ingress: "INGRESS_TRAFFIC_ALL",
      template: {
        scaling: { maxInstanceCount: 1, minInstanceCount: 0 },
        containers: [{ image: "us-docker.pkg.dev/cloudrun/container/hello" }],
      }
    });

    new CloudRunServiceIamBinding(this, "Binding", {
      service: service.name,
      location: service.location,
      role: "roles/run.invoker",
      members: ["allUsers"]
    })
  }
}

const app = new App();
new MyStack(app, "cdktf");
app.synth();
