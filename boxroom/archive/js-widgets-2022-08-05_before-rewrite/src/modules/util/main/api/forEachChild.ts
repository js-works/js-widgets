import { VNode } from '../../../core/main/index'
import toChildArray from './toChildArray'

export default function forEachChild(
  children: VNode,
  action: (child: VNode, index: number) => void
): void {
  toChildArray(children).forEach(action)
}
