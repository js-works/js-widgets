import { Component } from '../../../core/main/index'

export default function withOnUnmount<T, A extends any[]>(c: Component, f: (...args: A) => void):
  (...args: A) => void {

  let args: A | null = null
  
  c.onUnmount(() => {
    if (args) {
      f(...args)
    }
  })
  
  return (...a: A) => {
    args = a
  }
}
