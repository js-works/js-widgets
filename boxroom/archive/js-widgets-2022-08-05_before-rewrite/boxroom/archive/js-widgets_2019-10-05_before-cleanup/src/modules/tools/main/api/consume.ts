type Getter = () => any
type Getters = [Getter] | [Getter, Getter] | [Getter, Getter, Getter] | [Getter, Getter, Getter, Getter]

type Values<G extends Getters> =
  G extends [Getter]
    ? [ReturnType<G[0]>]
    : G extends [Getter, Getter]
      ? [ReturnType<G[0]>, ReturnType<G[1]>]
      : G extends [Getter, Getter, Getter]
        ? [ReturnType<G[0]>, ReturnType<G[1]>, ReturnType<G[2]>]
        : G extends [Getter, Getter, Getter, Getter]
          ? [ReturnType<G[0]>, ReturnType<G[1]>, ReturnType<G[2]>, ReturnType<G[3]>]
          : never

export default function consume<G extends Getters>(...getters: G):
  (f: (...args: Values<G>) => any) => any {

  return (f: any) => () => {
    const values: any[] = []

    for (let i = 0; i < getters.length; ++i) {
      values.push(getters[i]())
    }

    return f.apply(null, values)
  }
}
