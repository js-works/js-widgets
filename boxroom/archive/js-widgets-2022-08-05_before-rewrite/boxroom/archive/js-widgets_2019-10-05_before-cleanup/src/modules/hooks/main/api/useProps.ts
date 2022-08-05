import { Ctrl, Props } from '../../../core/main/index'
import PickOptionalProps from '../internal/types/PickOptionalProps'

export default function useProps<P extends Props, D extends PickOptionalProps<P>>(
  c: Ctrl<P>,
  defaultProps?: D
): () => P & Required<D> {
  const getProps = c.consumeProps()

  return !defaultProps
    ? getProps
    : () => Object.assign({}, defaultProps, getProps()) as any
}
