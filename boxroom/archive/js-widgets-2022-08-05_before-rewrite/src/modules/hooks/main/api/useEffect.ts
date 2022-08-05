import { Ctrl } from '../../../core/main/index'
import hook from './hook'

function useEffect(
  c: Ctrl,
  action: () => (void | (() => void)),
  dependencies?: null | (() => any[])
): void {
  let cleanup: void | (() => void)
  
  if (dependencies === null) {
    c.afterMount(() => {
      cleanup = action()
    })
  } else {
    let oldDeps: any[] | null = null

    c.afterUpdate(() => {
      const newDeps =
        typeof dependencies === 'function'
          ? dependencies()
          : null

      if (oldDeps === null || newDeps ===  null || !isEqual(oldDeps, newDeps)) {
        if (cleanup) {
          cleanup()
          cleanup = undefined 
        }

        cleanup = action()
      }

      oldDeps = newDeps
    })
  }

  c.beforeUnmount(() => {
    cleanup && cleanup()
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

// --- exports -------------------------------------------------------

export default hook('useEffect', useEffect)
