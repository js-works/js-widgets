import { Component } from '../../../core/main/index'

export default function withState<T, A extends any[]>(c: Component, init: (...args: A) => T):
  [(...args: A) => T, (updater: (T | ((oldState: T) => T))) => void] {

  let
    isInitialized = false,
    initialState: any = undefined,
    hasUpdatedState = false

  const
    [getState, setState] = c.handleState<T>(undefined!)

  function updateState(updater: (T | ((oldState: T) => T))) {
    if (!hasUpdatedState) {
      hasUpdatedState = true
      setState(initialState)
    }

    setState(updater)
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