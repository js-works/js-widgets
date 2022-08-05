import { Ctrl } from '../../../core/main/index'

type Updater<S extends object> = Partial<S> | ((oldState: S) => Partial<S>)

export default function useStateObject<S extends object>(
  c: Ctrl<any>,
  init: S
): [() => S, (updater: Updater<S>) => void] {

  const [get, set] = c.handleState(init)

  function update(updater: Updater<S>) {
    if (typeof updater === 'function') {
      set(oldState => {
        const result = (updater as any)(oldState)

        return {...oldState, ...result }
      })
    } else if (updater !== null && typeof updater === 'object') {
      set(oldState => ({ ...oldState, ...updater }))
    } else {
      throw new Error('Illegal state updater')
    } 
  }

  return [get, update]
}
