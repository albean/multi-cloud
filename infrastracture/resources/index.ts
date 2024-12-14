import { Resource } from "../common/Resource";

export const BuildType = Symbol("BuildType");
export const Build = Resource<{ path: string }>()(BuildType, {});
export type Build = ReturnType<typeof Build>;

export const ContainerType = Symbol("ContainerType");

export const Container = Resource<{ build: Build }>()(ContainerType, {
  expose: (_, domain: string) => {
    console.log("Hello!", { domain })
  }
});

