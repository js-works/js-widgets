import { Ctrl } from '../../../core/main/index'

import useEffect from './useEffect'
import useAsMutable from './useAsMutable'
import ValueOrMutable from './types/ValueOrMutable'

function useInterval(
  c: Ctrl,
  varCallback: ValueOrMutable<() => void>,
  varDelay: ValueOrMutable<number>
) {
  const
    callback = useAsMutable(c, varCallback),
    delay = useAsMutable(c, varDelay)
  
  useEffect(c, () => {
    const id = setInterval(callback.value, delay.value)

    return () => clearInterval(id)
  }, () => [callback.value, delay.value])
}


export default useInterval
