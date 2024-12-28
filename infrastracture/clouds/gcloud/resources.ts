import { digest } from "infrastracture/common/Resource";
import { Build, BuildType, ContainerType } from "infrastracture/resources";
import { ShellProvider } from ".gen/providers/shell/provider";
import { Script } from ".gen/providers/shell/script";
import { App, TerraformStack } from "cdktf";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { CloudRunV2Service } from "@cdktf/provider-google/lib/cloud-run-v2-service";
import { CloudbuildTrigger } from "@cdktf/provider-google/lib/cloudbuild-trigger";
import { Cloudbuildv2Repository } from "@cdktf/provider-google/lib/cloudbuildv2-repository";
import * as gcloud from "@cdktf/provider-google/lib"
import { LocalBackend } from 'cdktf';
import { scope, app } from "infrastracture/clouds/gcloud/scope";

type Constructor<T, Args extends any[]> = new (scope: any, ...args: Args) => T;

const tfResourceToFunc = <T, Args extends any[]>(Klass: Constructor<T, Args>): ((...args: Args) => T) =>
  (...args: Args) => new Klass(scope, ...args);

export const CloudRun = tfResourceToFunc(CloudRunV2Service);
export const CloudBuildTrigger = tfResourceToFunc(CloudbuildTrigger);
export const CloudBuildRepository = tfResourceToFunc(Cloudbuildv2Repository);
export const ServiceAccountIamBinding = tfResourceToFunc(gcloud.serviceAccountIamBinding.ServiceAccountIamBinding);
export const ProjectIamMember = tfResourceToFunc(gcloud.projectIamMember.ProjectIamMember);
export const ArtifactRegistryRepository = tfResourceToFunc(gcloud.artifactRegistryRepository.ArtifactRegistryRepository);
export const CloudRunServiceIamBinding = tfResourceToFunc(gcloud.cloudRunServiceIamBinding.CloudRunServiceIamBinding);
export const SqlDatabase = tfResourceToFunc(gcloud.sqlDatabase.SqlDatabase);
export const SqlDatabaseInstance = tfResourceToFunc(gcloud.sqlDatabaseInstance.SqlDatabaseInstance);
export const SqlUser = tfResourceToFunc(gcloud.sqlUser.SqlUser);
export const SecretManagerSecret = tfResourceToFunc(gcloud.secretManagerSecret.SecretManagerSecret);

export const location = "europe-west1";
export const project = "ultimate-life-396919";
export const projectNumber = "1087863064045";

