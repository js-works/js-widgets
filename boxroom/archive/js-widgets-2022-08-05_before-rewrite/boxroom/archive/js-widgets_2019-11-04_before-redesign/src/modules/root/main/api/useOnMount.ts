import { Ctrl } from '../../../core/main/index'

export default function useOnMount(
  c: Ctrl,
  action: () => void,
): void {
  let isMounted = false

  c.onDidUpdate(() => isMounted = true)

  if (!isMounted) {
    const unsubscribe = c.onDidUpdate(() => {
      unsubscribe()

      const result = action()

      if (typeof result === 'function') {
        c.onWillUnmount(result)
      }
    })
  }
}
