import { VirtualNode } from '../../../core/main/index'
import toChildArray from './toChildArray'

export default function childCount(children: VirtualNode): number {
  return toChildArray(children).length
}
