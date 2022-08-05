import { Ctrl, Props } from '../../../core/main/index'
import toProxy from '../../../tools/main/api/toProxy'
import PickOptionalProps from '../internal/types/PickOptionalProps'

export default function useProps<P extends Props, D extends PickOptionalProps<P>>(
  c: Ctrl<P>,
  defaultProps?: D
): [P & Required<D>, () => P & Required<D>] {
  const getProps = c.consumeProps()

  const getter = !defaultProps
    ? getProps
    : () => Object.assign({}, defaultProps, getProps()) as any

  return [toProxy(getter), getter]
}
