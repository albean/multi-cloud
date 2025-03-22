import { Resource } from "../common/Resource";

export class Secret extends Resource<{ name: string; }> {
  id: string

  key(name: string) {
    return new SecretKey({ secret: this, key: name });
  }
}
export class SecretKey extends Resource<{
  secret: Secret;
  key: string;
}> {}

export class DockerRepository extends Resource<{ name: string }> {}
export class Queue extends Resource<{ name: string }> { id: string }
export class PersistantStorage extends Resource<{ name: string }> {}

export class QueueConsumer extends Resource<{
  queue: Queue;
  service: Service;
}> {}

export class Image extends Resource<{
  repo: DockerRepositoryPath,
  dir: string,
  args?: Record<string, string>;
}> { id: string }

interface ServiceProps {
  image: Image,
  name: string;
  command?: string[];
  secrets?: { name: string, secret: SecretKey }[];
  env?: { name: string, value: string }[];
  memory?: number;
  expose?: boolean;
  mounts?: { storage: PersistantStorage, path: string }[],
}

export class Service extends Resource<ServiceProps> {
  exposedUrl: string

  consume(queue: Queue) {
    return new QueueConsumer({ service: this, queue });
  }
}

export interface DockerRepositoryPath {
  repo: DockerRepository,
  path: string,
}
