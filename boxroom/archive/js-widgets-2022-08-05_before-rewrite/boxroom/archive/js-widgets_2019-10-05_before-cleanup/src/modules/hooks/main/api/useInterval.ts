import { Ctrl } from '../../../core/main/index'

import useOnMount from './useOnMount'
import useEffect from './useEffect'

function useInterval(c: Ctrl, action: () => void, delay: number | (() => number) = 1000) {
  if (typeof delay === 'number') {
    useOnMount(c, () => {
      const id = setInterval(() => {
        action()
      }, delay)
      
      return () => clearInterval(id)
    })
  } else if (typeof delay === 'function') {   
    useEffect(c, () => {
      const
        id = setInterval(() => {
          action()
        }, delay())
      
      return () => clearInterval(id)
    }, () => [delay()])
  } else {
    throw new TypeError(
      '[useTime] Third argument must either be a number or a function')
  }
}

export default useInterval
