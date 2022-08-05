import { h as dyoCreateElement } from 'dyo'
import h from '../api/h'

const
  VirtualElement = h('div').constructor,

  SYMBOL_ITERATOR =
    typeof Symbol === 'function' && Symbol.iterator
      ? Symbol.iterator
      : '@@iterator'

function isElement(it: any) {
  return it && it.constructor === VirtualElement
}

function isIterableObject(it: any): boolean {
  return it !== null
    && typeof it === 'object'
    && (Array.isArray(it) || typeof it[SYMBOL_ITERATOR] === 'function')
}

export default function convertNode(node: any) {
  if (isIterableObject(node)) {
    return convertNodes(node)
  } else if (!isElement(node)) {
    return node
  }

  const
    type = node.type,
    props = node.props,

    children = props && props.children !== undefined
        ? props.children
        : null,

    newChildren = children !== null ? convertNode(children) : null

  const
    newType = typeof type === 'function' && typeof type.__type === 'function'
      ? type.__type
      : type

  let newProps = props ? { ...props } : null

  if (newChildren) {
    newProps.children = newChildren.length === 0 ? newChildren[0] : newChildren
  }

  let ret = null

  // TODO - optimize

  if (newProps) {
    delete newProps.key
  }

  if (node.key !== null) {
    newProps = newProps ? Object.assign({}, newProps) : {}

    if (node.key !== undefined && node.key !== null) {
      newProps.key = node.key
    }
  }

  if (!newProps || newProps.children === undefined) {
    ret = dyoCreateElement(newType, newProps)
  } else {
    const
      children = Array.isArray(newProps.children) ? newProps.children : [newProps.children],
      childCount = children.length,
      newArgs = new Array(childCount + 2)
    
    delete newProps.children
    newArgs[0] = newType
    newArgs[1] = newProps

    for (let i = 0; i < childCount; ++i) {
      newArgs[i + 2] = convertNode(children[i])
    }

    ret = dyoCreateElement.apply(null, newArgs as any)
  }

  return ret
}

function convertNodes(elements: any[]) {
  let ret = [...elements]

  for (let i = 0; i < elements.length; ++i) {
    const child = elements[i]

    if (isElement(child)) {
      ret[i] = convertNode(child)
    } else if (isIterableObject(child)) {
      ret[i] = convertNodes(child)
    }
  }

  if (ret.length === 1) {
    ret = ret[0]
  }

  return ret
}
