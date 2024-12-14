

type Resource<Type, Props> = {
  _type: Type,
}

declare type Cluster = Resource<"cluster", {}>;

type ServiceProps = {
  sibling: Service
}

declare type Service = Resource<"service", ServiceProps>


type AWSResource = { arn: string }

declare const AWSResource: AWSResource;

const Implementations = {
  service: AWSResource
}




