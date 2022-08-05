import { Component } from '../../../core/main/index'

export default function useOnUnount(
  c: Component,
  action: () => void,
): void {
  const unsubscribe = c.onUnmount(() => {
    unsubscribe()

    action()
  })
}
