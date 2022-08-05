import { VirtualNode } from '../../../core/main/index'
import toChildArray from './toChildArray'

export default function mapChildren<T>(
  children: VirtualNode,
  mapper: (child: VirtualNode) => T
): T[] {
  return toChildArray(children).map(mapper) 
}
