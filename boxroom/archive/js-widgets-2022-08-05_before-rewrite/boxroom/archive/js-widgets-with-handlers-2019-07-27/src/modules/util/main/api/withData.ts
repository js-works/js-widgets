type ObjectOfGetters = { [key: string]: () => any }

export default function withData<T extends ObjectOfGetters>(
    getters: T
): [{ [key in keyof T]: ReturnType<T[key]> }, (f: (data: { [key in keyof T]: ReturnType<T[key]> }) => any) => () => any] {

  const obj: any = {}

  for (let key of Object.keys(getters)) {
    Object.defineProperty(obj, key, {
      get: getters[key]
    })
  }

  return [obj, f => () => f(obj)] 
}
