import { Ctrl, Props } from '../../../core/main/index'
import useMutable from './useMutable'

type Updater<T> = T | ((oldValue: T) => T)

function useValue<T>(c: Ctrl, initialValue: T):
  [{ value: T }, (updater: Updater<T>) => void, () => T] {

  const [get, set] = c.handleState(initialValue)
  
  return [useMutable(c, get), set, get]
}

export default useValue
