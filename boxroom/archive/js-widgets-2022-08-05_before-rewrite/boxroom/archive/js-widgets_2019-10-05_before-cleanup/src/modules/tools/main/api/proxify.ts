import toProxy from './toProxy'

type Rec = Record<string, any>
type Subject<T> = (() => T) | Record<keyof T, T[keyof T]>

function proxify<A extends Rec>(
  getA: Subject<A>
): [A, <R>(f: (a: A) => R) => (() => R)]

function proxify<A extends Rec, B extends Rec>(
  getA: Subject<A>, getB: Subject<B>
): [A, B, <R>(f: (a: A, b: B) => R) => () => R]

function proxify<A extends Rec, B extends Rec, C extends Rec>(
  getA: Subject<A>, getB: Subject<B>, getC: Subject<C>
): [A, B, C, <R>(f: (a: A, b: B, c: C) => R) => () => R]

function proxify<A extends Rec, B extends Rec, C extends Rec, D extends Rec>(
  getA: Subject<A>, getB: Subject<B>, getC: Subject<C>, SubjectD: Subject<D>
): [A, B, C, D, <R>(f: (a: A, b: B, c: C, d: D) => R) => () => R]

function proxify<A extends Rec, B extends Rec, C extends Rec, D extends Rec, E extends Rec>(
  getA: Subject<A>, getB: Subject<B>, getC: Subject<C>, getD: Subject<D>
): [A, B, C, D, E, <R>(f: (a: A, b: B, c: C, d: D, e: E) => R) => () => R]

function proxify(...args: any[]): any {
  const ret: any = []

  for (let i = 0; i < args.length; ++i) {
    ret[i] = toProxy(args[i])
  }

  ret.push((f: Function) => {
    return () => {
      const values: any = []

      for (let i = 0; i < args.length; ++i) {
        if (typeof args[i] === 'function') {
          values[i] = args[i]()
        } else {
          const obj: any = {}

          for (const key of Object.keys(args[i])) {
            obj[key] = args[i][key]()
          }

          values[i] = obj
        }
      }

      return f.apply(null, values)
    } 
  })

  return ret
}

export default proxify
