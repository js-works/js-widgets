import { VNode } from '../../../core/main/index'
import toChildArray from './toChildArray'

export default function withChildren<R>(
  f: (nodes: VNode[]) => R): (children: VNode) => R
{
  if (process.env.NODE_ENV === 'development' as any) {
    if (typeof f !== 'function') {
      throw new TypeError('[withChildren] First argument "f" must be a function')
    }
  }

  return (children: VNode) => f(toChildArray(children))
}
