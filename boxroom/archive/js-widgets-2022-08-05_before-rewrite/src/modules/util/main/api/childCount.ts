import { VNode } from '../../../core/main/index'
import toChildArray from './toChildArray'

export default function childCount(children: VNode): number {
  return toChildArray(children).length
}
