import { Component, Context } from '../../../core/main/index'

interface Methods {
  [name: string]: (...args: any[]) => any 
}

export default function useMethods<M extends Methods>(
  c: Component,
  ref: any,
  methods: Methods
) {
  if (!c.isMounted()) {
    const unsubscribe = c.onUpdate(() => {
      unsubscribe()

      if (typeof ref === 'function') {
        ref(methods)
      } else if (ref !== null && typeof ref === 'object') {
        ref.current = methods
      }

      return () => {
        if (typeof ref === 'function') {
          ref(null)
        } else if (ref !== null && typeof ref === 'object') {
          ref.current = null 
        }
      }
    })
  }
}
