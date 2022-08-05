import { Ctrl } from '../../../core/main/index'

export default function useOnUnount(
  c: Ctrl,
  action: () => void,
): void {
  const unsubscribe = c.onWillUnmount(() => {
    unsubscribe()

    action()
  })
}
