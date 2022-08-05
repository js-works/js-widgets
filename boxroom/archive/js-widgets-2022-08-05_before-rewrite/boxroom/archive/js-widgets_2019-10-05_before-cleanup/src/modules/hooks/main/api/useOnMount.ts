import { Ctrl } from '../../../core/main/index'

export default function useOnMount(
  c: Ctrl,
  action: () => void,
): void {
  let isMounted = false

  c.onUpdate(() => isMounted = true)

  if (!isMounted) {
    const unsubscribe = c.onUpdate(() => {
      unsubscribe()

      const result = action()

      if (typeof result === 'function') {
        c.onUnmount(result)
      }
    })
  }
}
