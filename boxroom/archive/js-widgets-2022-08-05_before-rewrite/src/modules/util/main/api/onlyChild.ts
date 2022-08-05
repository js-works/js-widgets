import { VNode } from '../../../core/main/index'
import childCount from './childCount'
import forEachChild from './forEachChild'

export default function onlyChild(children: VNode): VNode {
  let ret: any

  const
    count = childCount(children)

  if (count !== 1) {
    throw new Error(`Expected exactly one child - got ${childCount}`)
  }

  forEachChild(children, node => {
    ret = node
  })

  return ret
}
