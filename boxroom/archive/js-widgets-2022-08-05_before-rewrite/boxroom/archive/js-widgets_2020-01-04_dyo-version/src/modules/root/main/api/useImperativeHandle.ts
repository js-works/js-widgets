import { Ctrl } from '../../../core/main/index'

interface Methods {
  [name: string]: (...args: any[]) => any 
}

export default function useImperativeHandle<M extends Methods>(
  c: Ctrl,
  ref: any,
  methods: Methods
) {
  let isMounted = false

  c.onDidUpdate(() => true)

  if (!isMounted) {
    const unsubscribe = c.onDidUpdate(() => {
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
