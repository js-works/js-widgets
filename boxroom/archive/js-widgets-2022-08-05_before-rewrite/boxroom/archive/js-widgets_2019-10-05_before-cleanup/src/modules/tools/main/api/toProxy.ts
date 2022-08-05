type Proxifiable =
  () => { [key: string]: any}
    | { [key: string]: () => any }

function toProxy<T extends Record<string, any>>(getter: () => T): T

function toProxy<G extends Record<string, () => any>>(getters: G): { [key in keyof G]: G[key] }

function toProxy(what: any): any {
  let ret, get, has, ownKeys, getOwnPropertyDescriptor

  if (typeof what === 'function') {
    get = (_: any, name: string) => what()[name],
    has = (_: any, name: string) => (name in what())

    ownKeys = () => {
       return Object.keys(what())
    }

    getOwnPropertyDescriptor = function (_: any, name: any) {
      return Object.getOwnPropertyDescriptor(what(), name)
    }

    ret = new Proxy({}, {
      get,
      ownKeys,
      has,
      getOwnPropertyDescriptor
    })
  } else {
    const target = {}

    for (const key of Object.keys(what)) {
      Object.defineProperty(target, key, {
        enumerable: true,
        get: what[name]
      })
    }

    ret = new Proxy(target, {})
  }

  return ret
}

export default toProxy
