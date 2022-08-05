import { Component } from '../../../core/main/index'

type Updater<T extends object> = Partial<T> | ((oldState: T) => Partial<T>)

export default function useStateObject<T extends object>(c: Component, initialValue: T):
  [() => T, (updater: Updater<T>) => void] {

  const [get, set] = c.handleState(initialValue)

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

  return [get, update]
}
