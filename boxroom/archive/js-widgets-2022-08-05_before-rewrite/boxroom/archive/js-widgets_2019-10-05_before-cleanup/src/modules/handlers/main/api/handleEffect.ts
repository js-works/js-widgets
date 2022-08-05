import { Ctrl } from '../../../core/main/index'
import isSameArray from '../internal/isSameArray'

type Cleanup = () => void
type Effect<A extends any[]> = (...args: A) => Cleanup | void

export default function handleEffect<A extends any[]>(
  c: Ctrl,
  fn: (...args: A) => Cleanup | void,
  comparator?: (prevArgs: A, nextArgs: A) => boolean
): (...args: A) => void {

  let
    effect: Effect<A> | null = null,
    cleanup: Cleanup | null = null,
    prevArgs: A | null = null

  c.onUpdate(() => {
    if (effect) {
      if (cleanup) {
        cleanup()
        cleanup = null
      }
      
      cleanup = effect(...prevArgs!) || null
    }
  })

  c.onUnmount(() => { 
    if (cleanup) {
      cleanup()
      cleanup = null
    }
  })

  const ret = (...args: A) => {
    if (prevArgs) {
      if (comparator && !comparator(prevArgs, args)
        || !comparator && isSameArray(prevArgs, args)) {

        effect = null
        return
      }
    }

    effect = fn 
    prevArgs = args
  }
  
  return ret
}
