import { Props, Ctrl } from '../../../core/main/index'

export default function hook<
  P extends Props,
  A extends any[],
  R
>(
  name: string,
  f: (c: Ctrl<P>, ...args: A) => R
): (c: Ctrl<P>, ...args: A) => R {
  function ret() {
    if (process.env.NODE_ENV === 'development' as any) {
      const c = arguments[0]

      if (!c || typeof c !== 'object' || typeof c.isInitialized !== 'function') {
        throw new TypeError(`First argument of hook function "${name}" must be a component controller`)
      } else if (c.isInitialized()) {
        throw new Error(
          `Hook function "${name}" has been called after initialization phase of component "${c.getName()}"`)
      }
    }

    return (f as any).apply(null, arguments)
  }

  Object.defineProperty(ret, 'name', {
    value: name
  })

  return ret
}
