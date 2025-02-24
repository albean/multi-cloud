const impl = {} as any;
const Values = new Map() as Map<any, any>;

export type Resource<S extends symbol, Props, Attr = {}> = {
  _symbol: S,
  _props: Props,
  _attr: Attr,
}

type Extension<T extends Record<string, (...args: any[]) => {}>> = {
  [P in keyof T]: DropFirstArg<T[P]>;
}

export const Resource = <P, A = {}>() =>
  <T extends symbol, E extends Record<string, (itself: Resource<T, P> & E, ...args: any) => any>>(symbol: T, extension: E) => {
    const res = (props: P): Resource<T, P, A> & Extension<E> & A => {
      const resource = {};

      const fn = impl[symbol];

      const attr = fn ? fn(props) : {};
      Values.set(resource, attr);

      Object.entries(extension).map(([k, v]) => {
        resource[k] = (...args: any) => extension[k](resource as any, ...args) as any
      });


      Object.assign(resource, attr);

      return resource as any;
    };

    res._symbol = symbol;

    return res;
  }

const any: any = {};

type DropFirstInTuple<T extends unknown[]> = T extends [any, ...infer U] ? U : never;

type DropFirstArg<T> = T extends (...args: infer Args) => infer R
  ? (...args: DropFirstInTuple<Args>) => R
  : never;

export const implement = <P, A, R extends A>(res: (props: P) => Resource<any, any, A>, _impl: (props: P) => R) => {
  const symbol = (res as any)._symbol;
  // console.log("Registered implementation", symbol)
  impl[symbol] = _impl;

  return _impl;
};


export const digest = <V extends Record<K, any>, K extends symbol & keyof V>(spec: V) =>
  <S extends K>(of: Resource<S, any>) => {
    const val = Values.get(of)

    return val as ReturnType<V[S]>
  }




