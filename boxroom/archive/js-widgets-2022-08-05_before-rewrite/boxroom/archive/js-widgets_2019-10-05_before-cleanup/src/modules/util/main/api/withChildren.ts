import { VirtualNode } from '../../../core/main/index'
import toChildArray from './toChildArray'

export default function withChildren<R>(
  f: (nodes: VirtualNode[]) => R): (children: VirtualNode) => R
{
  if (process.env.NODE_ENV === 'development' as any) {
    if (typeof f !== 'function') {
      throw new TypeError('[withChildren] First argument "f" must be a function')
    }
  }

  return (children: VirtualNode) => f(toChildArray(children))
}
