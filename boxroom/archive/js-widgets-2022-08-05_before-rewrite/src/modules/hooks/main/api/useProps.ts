import { Ctrl, Props } from '../../../core/main/index'
import hook from './hook'

function useProps<
  P extends Props,
  D extends PickOptionalProps<P>
>(c: Ctrl<P>, defaultProps?: ValidateShape<D, PickOptionalProps<P>>): P & D {
  const props = Object.assign({}, defaultProps, c.getProps())

  c.beforeUpdate(() => {
    for (const propName in props) {
      delete props[propName]
    }

    Object.assign(props, defaultProps, c.getProps())
  })

  return props
}

// --- types ---------------------------------------------------------

type ValidateShape<T, Shape> =
  T extends Shape ?
  Exclude<keyof T, keyof Shape> extends never ?
  T : never : never;

type PickOptionalProps<T extends Record<string, any>> = Pick<T, {
  [K in keyof T]: T extends Record<K, T[K]> ? never : K
}[keyof T]>

// --- exports -------------------------------------------------------

export default hook('useProps', useProps)
