import { Ctrl } from '../../../core/main/index'

import useState from './useValue'
import useInterval from './useInterval'
import ValueOrMutable from './types/ValueOrMutable'

function useTime(
  c: Ctrl,
  varDelay?: ValueOrMutable<number>
): { value: Date } 

function useTime<R>(
  c: Ctrl,
  varDelay?: ValueOrMutable<number>,
  mapper?: (date: Date) => R
): { value: R }

function useTime(c: Ctrl, varDelay: any = 1000, mapper?: any): any {
  const [$time, setTime] =
    useState(c, mapper ? mapper(new Date()) : new Date())

  useInterval(c, () => {
    let value = new Date()

    if (mapper) {
      value = mapper(value)
    }

    setTime(value)
  }, varDelay)

  return $time
}

function identity<T>(value: T) {
  return value
}

export default useTime
