import { Resource } from "../common/Resource";

// export const BuildType = Symbol("BuildType");
// export const Build = Resource<{ path: string }>()(BuildType, {});
// export type Build = ReturnType<typeof Build>;
//
// export const ContainerType = Symbol("ContainerType");
// export const Container = Resource<{ build: Build }>()(ContainerType, {
//   expose: (_, domain: string) => {
//     console.log("Hello!", { domain })
//   }
// });



export const QueueType = Symbol("QueueType");
export const Queue = Resource<{ name: string }>()(QueueType, {});
export type Queue = Resource<typeof QueueType, {}>

export const SecretType = Symbol("SecretType");
export const Secret = Resource<{ name: string }>()(SecretType, {
  key: (secret, key: string) => {
    return SecretKey({ secret, key });
  }
});
export type Secret = Resource<typeof SecretType, {}>


export const SecretKeyType = Symbol("SecretKeyType");
export const SecretKey = Resource<{ secret: Secret, key: string }>()(SecretKeyType, {});
export type SecretKey = Resource<typeof SecretKeyType, {}>

export const ServiceType = Symbol("ServiceType");
export const Service = Resource<{
  repo: DockerRepositoryPath;
  name: string;
  command?: string;
  secrets?: { name: string, secret: SecretKey }[];
  env?: { name: string, value: string }[];
  memory?: number;
  expose?: boolean;
}, {
  exposedUrl: string
}>()(ServiceType, {
  consume: (service, queue: Queue) => {
    return QueueConsumer({ service, queue });
  },
});
export type Service = Resource<typeof ServiceType, {}>

export const DockerRepositoryType = Symbol("DockerRepositoryType");
export const DockerRepository = Resource<{
  name: string,
}, {
  url: string
} >()(DockerRepositoryType, {});
export type DockerRepository = Resource<typeof DockerRepositoryType, {}>

export const QueueConsumerType = Symbol("QueueConsumerType");
export const QueueConsumer = Resource<{ queue: Queue, service: Service }>()(QueueConsumerType, {});
export type QueueConsumer = Resource<typeof QueueConsumerType, {}>

interface PipelineProps {
  services: Service[],
  dockerfile: string,
  repo: DockerRepositoryPath;
}
export const PipelineType = Symbol("PipelineType");
export const Pipeline = Resource<PipelineProps>()(PipelineType, {});
export type Pipeline = Resource<typeof PipelineType, {}>

export interface DockerRepositoryPath {
  repo: DockerRepository,
  path: string,
}
