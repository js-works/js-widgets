import { Ctrl } from '../../../core/main/index'
import useMutableData from './useMutableData'

type Updater<T extends object> = Partial<T> | ((oldState: T) => Partial<T>)

export default function useState<T extends object>(c: Ctrl, initial: T):
  [T, (updater: Updater<T>) => void] {

  const [get, set] = c.handleState(initial)

  function update(updater: Updater<T>) {
    if (typeof updater === 'function') {
      set(oldState => {
        const result = (updater as any)(oldState)

        return {...oldState, ...result }
      })
    } else if (updater !== null && typeof updater === 'object') {
      set(oldState => ({ ...oldState, ...updater }))
    }
  }

  return [useMutableData(c, get), update]
}
