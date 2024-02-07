import { Application } from "../app/Application";
import { Build, BuildType, ContainerType } from "../app/Constructs";
import { Resource, digest } from "../common/Resource";
import { BuildImpl } from "./Development/Build";
import { ContainerImpl } from "./Development/Container";


export const $ = digest({
  [BuildType]: BuildImpl,
  [ContainerType]: ContainerImpl,
})

Application({
  domain: `localhost.tv`,
})


//////////

// const builder = <V extends Record<symbol, any>, K extends keyof V & symbol>(start: V) => ({
//   implement: <T extends Record<symbol, any>>(
//     ipl: T
//   ) => builder({} as V & T),
//   solidify: () => <S extends K>(s: Resource<S, any>) => ({}) as ReturnType<V[S]>,
//
// })
//
// const build = Build({ path: 'any' })
//
// export const $$ = builder({})
//   .implement({ [BuildType]: () => ({ myCustom: true }) })
//   .implement({ [ContainerType]: ContainerImpl })
//   .solidify();
//
