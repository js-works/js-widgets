import { Ctrl } from '../../../core/main/index'

export default function handleState<T, A extends any[]>(
  c: Ctrl,
  init: (...args: A) => T,
): [(...args: A) => T, (updater: (T | ((oldState: T) => Partial<T>))) => void] {

  let
    isInitialized = false,
    initialState: any = undefined,
    hasUpdatedState = false

  const
    [getState, setState] = c.handleState<T>(undefined!)

  function updateState(updater: (T | ((oldState: T) => Partial<T>))) {
    if (!hasUpdatedState) {
      hasUpdatedState = true
      setState(initialState)
    }

    if (typeof updater === 'function') {
      const state = getState()

      setState(Object.assign({}, state, (updater as any)(state))) // TODO!!!
    } else {
      setState(Object.assign({}, getState(), updater))
    }
  }

  function useState(...args: A) {
    let ret: T

    if (!isInitialized) {
      initialState = init(...args)
      ret = initialState
      isInitialized = true
    } else {
      ret = getState()
    }

    return ret 
  }

  return [useState, updateState] as any
}
