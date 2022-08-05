import { Component } from '../../../core/main/index'

export default function useEffect(
  c: Component,
  action: () => void,
  getDependencies?: () => any[] | null
): void {
  let oldDeps: any[] | null = null

  c.onUpdate(() => {
    const newDeps = getDependencies ? getDependencies() : null

    if (oldDeps === null || newDeps ===  null || !isEqual(oldDeps, newDeps)) {
      action()
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