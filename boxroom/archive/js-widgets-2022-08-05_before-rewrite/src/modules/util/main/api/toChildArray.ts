import { VNode } from '../../../core/main/index'

const SymbolIterator =
  typeof Symbol === 'function'
    ? Symbol.iterator
    : '@@iterator'

export default function toChildArray(children: VNode): VNode[] {
  return children === undefined || children === null
    ? []
    : Array.isArray(children)
    ? (children as any).flat()
    : typeof children === 'object'
      && typeof (children as any)[SymbolIterator] === 'function'
    ? toChildArray(Array.from(children as any) as any)
    : [children]
}