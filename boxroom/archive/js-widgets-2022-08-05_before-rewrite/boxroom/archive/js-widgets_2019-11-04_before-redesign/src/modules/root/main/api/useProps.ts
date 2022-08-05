import { Ctrl, Props } from '../../../core/main/index'
import useMutableData from './useMutableData'
import PickOptionalProps from '../internal/types/PickOptionalProps'

export default function useProps<P extends Props>(
  c: Ctrl<P>,
  defaultProps?: Partial<PickOptionalProps<P>>
): [P, () => P] {
  const
    getProps = c.consumeProps(),

    getDefaultedProps = defaultProps
      ? () => Object.assign({}, defaultProps, getProps())
      : getProps

  return [useMutableData(c, getDefaultedProps), getDefaultedProps]
}