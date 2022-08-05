import { Ctrl } from '../../../core/main/index'

export default function useOnUpdate(
  c: Ctrl,
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
