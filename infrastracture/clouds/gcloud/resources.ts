import { CloudRunV2Service } from "@cdktf/provider-google/lib/cloud-run-v2-service";
import { CloudbuildTrigger } from "@cdktf/provider-google/lib/cloudbuild-trigger";
import { Cloudbuildv2Repository } from "@cdktf/provider-google/lib/cloudbuildv2-repository";
import * as gcloud from "@cdktf/provider-google/lib"
import { TerraformOutput, LocalBackend } from 'cdktf';
import { scope, app } from "infrastracture/clouds/gcloud/scope";

type Constructor<T, Args extends any[]> = new (scope: any, ...args: Args) => T;

const tfResourceToFunc = <T, Args extends any[]>(Klass: Constructor<T, Args>): ((...args: Args) => T) =>
  (...args: Args) => new Klass(scope, ...args);

// @see https://registry.terraform.io/providers/hashicorp/google/6.14.1/docs/resources/cloud_run_v2_service google_cloud_run_v2_service
export const CloudRun = tfResourceToFunc(CloudRunV2Service);
export type CloudRun = CloudRunV2Service;

export const CloudBuildTrigger = tfResourceToFunc(CloudbuildTrigger);
export const CloudBuildRepository = tfResourceToFunc(Cloudbuildv2Repository);
export const ServiceAccountIamBinding = tfResourceToFunc(gcloud.serviceAccountIamBinding.ServiceAccountIamBinding);
export const ServiceAccount = tfResourceToFunc(gcloud.serviceAccount.ServiceAccount);
export const ProjectIamMember = tfResourceToFunc(gcloud.projectIamMember.ProjectIamMember);
export const ArtifactRegistryRepository = tfResourceToFunc(gcloud.artifactRegistryRepository.ArtifactRegistryRepository);
export const CloudRunServiceIamBinding = tfResourceToFunc(gcloud.cloudRunServiceIamBinding.CloudRunServiceIamBinding);
export const SqlDatabase = tfResourceToFunc(gcloud.sqlDatabase.SqlDatabase);
export const SqlDatabaseInstance = tfResourceToFunc(gcloud.sqlDatabaseInstance.SqlDatabaseInstance);
export const SqlUser = tfResourceToFunc(gcloud.sqlUser.SqlUser);
export const SecretManagerSecret = tfResourceToFunc(gcloud.secretManagerSecret.SecretManagerSecret);
export const StorageBucket = tfResourceToFunc(gcloud.storageBucket.StorageBucket);

export const PubsubTopic = tfResourceToFunc(gcloud.pubsubTopic.PubsubTopic);
export type PubsubTopic = gcloud.pubsubTopic.PubsubTopic;

// Represents a {@link https://registry.terraform.io/providers/hashicorp/google/6.14.1/docs/resources/pubsub_subscription google_pubsub_subscription}
export const PubsubSubscription = tfResourceToFunc(gcloud.pubsubSubscription.PubsubSubscription);

export const Out = tfResourceToFunc(TerraformOutput);

export const location = "europe-west1";

