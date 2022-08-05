import { Ctrl, R } from '../../../core/main/index'
import hook from './hook'

import useValue from './useValue'
import useInterval from './useInterval'

function useTime(
  c: Ctrl,
  delay?: R<number>
): { value: Date } 

function useTime(
  c: Ctrl,
  delay?: R<number>
): { value: Date }

function useTime<T>(
  c: Ctrl,
  delay: R<number>,
  getValue: () => T
): { value: T }

function useTime(c: Ctrl, delay: any = 1000, getValue: any = getDate): any {
  const [value, setValue] =
    useValue(c, getValue())

  useInterval(c, () => {
    setValue(getValue())
  }, delay)

  return value
}

function getDate() {
  return new Date()
}

export default hook('useTime', useTime)
