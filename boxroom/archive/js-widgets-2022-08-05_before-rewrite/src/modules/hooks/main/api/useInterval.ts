import { Ctrl, R } from '../../../core/main/index'
import { toRef } from '../../../util/main/index'
import useEffect from './useEffect'
import hook from './hook'

function useInterval(
  c: Ctrl,
  callback: R<() => void>,
  delay: R<number>
) {
  const
    callbackRef = toRef(callback),
    delayRef = toRef(delay)
  
  useEffect(c, () => {
    const id = setInterval(callbackRef.current, delayRef.current)

    return () => clearInterval(id)
  }, () => [callbackRef.current, delayRef.current])
}

export default hook('useInterval', useInterval)
