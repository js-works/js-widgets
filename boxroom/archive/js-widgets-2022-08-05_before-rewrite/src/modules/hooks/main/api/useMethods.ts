import { Ctrl, Props, Ref } from '../../../core/main/index'
import hook from './hook'

// TODO!!!!! - this is not working at all!
function useMethods<
  M extends Record<string, (...args: any[]) => any>,
  P extends Props & { ref?: Ref<M> }
>(
  c: Ctrl<P>,
  methods: M
) {
  const ref = c.getProps().ref 

  if (ref && typeof ref === 'object') {
    ref.current = methods
  }
}

export default hook('useMethods', useMethods)
