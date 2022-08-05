import { Component } from '../../../core/main/index'

export default function useOnMount(
  c: Component,
  action: () => void,
): void {
  if (!c.isMounted()) {
    const unsubscribe = c.onUpdate(() => {
      unsubscribe()

      action()
    })
  }
}
