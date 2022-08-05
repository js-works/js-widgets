import { VirtualNode } from '../../../core/main/index'

const SymbolIterator =
  typeof Symbol === 'function'
    ? Symbol.iterator
    : '@@iterator'

export default function toChildArray(children: VirtualNode): VirtualNode[] {
  return children === undefined || children === null
    ? []
    : Array.isArray(children)
    ? (children as any).flat()
    : typeof children === 'object'
      && typeof children[SymbolIterator] === 'function'
    ? toChildArray(Array.from(children))
    : [children]
}