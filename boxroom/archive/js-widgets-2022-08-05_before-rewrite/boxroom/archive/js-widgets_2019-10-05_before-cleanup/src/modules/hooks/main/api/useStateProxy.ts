import { Ctrl, Props } from '../../../core/main/index'
import useStateObject from './useStateObject'
import toProxy from '../../../tools/main/api/toProxy'

type Updater<T extends object> = Partial<T> | ((oldState: T) => Partial<T>)

export default function useStateProxy<S extends object>(
  c: Ctrl<any>,
  init: S
): [S, (updater: Updater<S>) => void, () => S] {
  const [getState, setState] = useStateObject(c, init)

  return [toProxy(getState), setState, getState]
}
