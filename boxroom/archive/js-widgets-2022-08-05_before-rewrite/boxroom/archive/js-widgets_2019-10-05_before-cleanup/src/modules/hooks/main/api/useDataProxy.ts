import { Ctrl } from '../../../core/main/index'

function useDataProxy<G extends Record<string, () => any>>(
  c: Ctrl,
  getters: G
): [{ [key in keyof G]: ReturnType<G[key]> }, () => { [key in keyof G]: ReturnType<G[key]> }] {
  const target = {}

  for (const key of Object.keys(getters)) {
    Object.defineProperty(target, key, {
      enumerable: true,
      get: getters[key]
    })
  }

  return [new Proxy(target, {}), () => Object.assign({}, target)] as any
}

export default useDataProxy
