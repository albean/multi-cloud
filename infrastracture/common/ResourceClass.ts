export const implementationRegistry = new Map<any, any>();
export const instanceRegistry = new Map<any, any>();// infrastructure/library/resource.ts

export abstract class Resource<Props> {
  props: Props

  constructor(props: Props) {
    this.props = props;
    const implementation = implementationRegistry.get(this.constructor);

    if (!implementation) {
      return;
    }

    const underlyingInstance = implementation(this.props);
    instanceRegistry.set(this, {...underlyingInstance, ...props})

    Object.assign(this, underlyingInstance)
  }
}

type Instance<T> = T extends new (...args: any[]) => infer R ? R : never;
type Props<T> = T extends typeof Resource<infer Props> ? Props : never;

type ImplementFn = <Class, P>(klass: Class, implementation: (prp: Props<Class>) => P) => {
  getProps: (i: Instance<Class>) => P & Props<Class>
};

export const implement: ImplementFn = (klass, imp) => {
  implementationRegistry.set(klass, imp)

  return {
    getProps: (instance) => instanceRegistry.get(instance)
  }
}
