import { Ctrl } from '../../../core/main/index'
import isSameArray from '../internal/isSameArray'

type Callback<A extends any[], R> = (...args: A) => R 

// TODO - strange implementation, does not even need argument `c`!?!

export default function handleCallback<T, A1 extends any[], A2 extends any[] = [], R = void>(
  c: Ctrl,
  init: (...args: A1) => Callback<A2, R>,
  comparator?: (prevArgs: A1, nextArgs: A1) => boolean
): (...args: A1) => Callback<A2, R> {

  let
    callback: Callback<A2, R>,
    prevArgs: A1

  return (...args: A1) => {
    if (prevArgs) {
      if (comparator && !comparator(prevArgs, args)
        || !comparator && isSameArray(prevArgs, args)) {
        
        return callback
      }
    }

    callback = init(...args)
    prevArgs = args

    return callback
  }
}
