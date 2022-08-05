import { Ctrl } from '../../../core/main/index'
import hook from './hook'

type Updater<T extends object> = Partial<T> | ((oldState: T) => Partial<T>)

function useState<T extends object>(c: Ctrl, initial?: T):
  [T, (updater: Updater<T>) => void] {

  const state: T = initial || {} as T

  function update(updater: Updater<T>) {
    c.update(() => {
      if (typeof updater === 'function') {
        Object.assign(state, (updater as any)(state))
      } else if (updater !== null && typeof updater === 'object') {
        Object.assign(state, updater)
      }
    })
  }

  return [state, update]
}

export default hook('useState', useState)
