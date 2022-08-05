import { VNode } from '../../../core/main/index'
import toChildArray from './toChildArray'

export default function mapChildren<T>(
  children: VNode,
  mapper: (child: VNode) => T
): T[] {
  return toChildArray(children).map(mapper) 
}
