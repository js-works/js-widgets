import { Component, Props, VirtualNode } from '../../../core/main/index'

function flow<
  P extends Props,
  S extends State,
  D extends Partial<PickOptionalProps<P>>,
  A extends { [key: string]: (...args: any[]) => any },
  E extends { [k: string]: <T>(ev: T, props: P, state: S) => ActionTypes<A>},
  X extends object
>(flow: FlowConfig<P, D, S, A, E, X>): Component<P> {
  // TODO!!!
  return null as any
}

type State = Record<string, any>

type FlowConfig<
  P extends Props,
  D extends Partial<PickOptionalProps<P>>,
  S extends State,
  A extends { [key: string]: (...args: any[]) => any },
  E extends { [k: string]: <T>(ev: T, props: P, state: S, data: X) => ActionTypes<A>},
  X extends object
> = {
  displayName: string,
  defaultProps?: Partial<P>,
  actions?: A,
  initState?(props: P): S,
  reduceState?(state: S, action: ActionTypes<A>): Partial<S> | undefined,
  
  events?: {
    [k: string]: <T>(ev: T, props: P, state: S, data: X) => ActionTypes<A>
  },
  
  lifecycle?: {
    onMount?(props: P, state: S, data: X): ActionTypes<A>
    onMount?(props: P, state: S, data: X): ActionTypes<A>
    onUnmount?(props: P, state: S, data: X): ActionTypes<A>
  },

  render(
    props: P,
    state: S,
    data: X,
    events: { [K in keyof E]: ((e: FirstArgument<E[K]>) => void) }
  ): VirtualNode
}

type ActionTypes<A extends { [key: string]: (...args: any[]) => any }> =
   { [K in keyof A]: { type: K, payload: ReturnType<A[K]> } }

type Arguments<F extends ((...args: any[]) => any)> =
  F extends (...args: infer A) => any ? A : never

type FirstArgument<F extends ((first: any, ...rest: any[]) => any)> =
  F extends (first: infer T, ...args: any[]) => any ? T : never

type PickOptionalProps<T> = Pick<T, {
  [K in keyof T]: T extends Record<K, T[K]> ? never : K
}[keyof T]>
