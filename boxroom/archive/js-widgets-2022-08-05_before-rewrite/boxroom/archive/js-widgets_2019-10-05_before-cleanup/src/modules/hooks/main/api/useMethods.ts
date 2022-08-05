import { Ctrl, Context } from '../../../core/main/index'

interface Methods {
  [name: string]: (...args: any[]) => any 
}

export default function useMethods<M extends Methods>(
  c: Ctrl,
  ref: any,
  methods: Methods
) {
  let isMounted = false

  c.onUpdate(() => true)

  if (!isMounted) {
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
