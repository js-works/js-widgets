import { Ctrl } from '../../../core/main/index'
import hook from './hook'

type Updater<T> = T | ((oldValue: T) => T)

function useValue<T>(c: Ctrl, initialValue: T):
  [{ value: T }, (updater: Updater<T>) => void] {

  const
    state = { value: initialValue },

    updateValue = (updater: Updater<T>) => {
      c.update(() => {
        if (typeof updater !== 'function') {
          state.value = updater
        } else {
          state.value = (updater as any)(state.value) // TODO
        }
      })
    }

  return [state, updateValue]
}

export default hook('useValue', useValue)
