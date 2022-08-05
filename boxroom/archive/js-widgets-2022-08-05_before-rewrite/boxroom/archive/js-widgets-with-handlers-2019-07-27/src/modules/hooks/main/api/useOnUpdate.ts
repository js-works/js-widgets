import { Component } from '../../../core/main/index'

export default function useOnUpdate(
  c: Component,
  action: () => (() => void) | void,
): void {
  let cleanup: (() => void) | null = null

  c.onUpdate(() => {
    if (cleanup) {
      cleanup()
    }

    cleanup = action() || null
  })
}
