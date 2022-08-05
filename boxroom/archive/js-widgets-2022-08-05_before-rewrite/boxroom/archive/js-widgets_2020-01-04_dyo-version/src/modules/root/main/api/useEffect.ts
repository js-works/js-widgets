import { Ctrl } from '../../../core/main/index'

export default function useEffect(
  c: Ctrl,
  action: () => void,
  dependencies?: null | (() => any[])
): void {
  let oldDeps: any[] | null = null
  let cleanup: any = null

  c.onDidUpdate(() => {
    const newDeps =
      typeof dependencies === 'function'
        ? dependencies()
        : null

    if (oldDeps === null || newDeps ===  null || !isEqual(oldDeps, newDeps)) {
      if (cleanup) {
        cleanup()
        cleanup = null
      }

      cleanup = action()
    }

    oldDeps = newDeps
  })
}

// --- locals -------------------------------------------------------

function isEqual(arr1: any[], arr2: any[]):  boolean {
  let ret = Array.isArray(arr1) && Array.isArray(arr2) && arr1.length === arr2.length

  if (ret) {
    for (let i = 0; i < arr1.length; ++i) {
      if (arr1[i] !== arr2[i]) {
        ret = false
        break
      }
    }
  }

  return ret
}