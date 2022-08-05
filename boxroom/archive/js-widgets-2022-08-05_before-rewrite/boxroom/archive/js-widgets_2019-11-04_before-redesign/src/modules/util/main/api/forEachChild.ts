import { VirtualNode } from '../../../core/main/index'
import toChildArray from './toChildArray'

export default function forEachChild(
  children: VirtualNode,
  action: (child: VirtualNode, index: number) => void
): void {
  toChildArray(children).forEach(action)
}
