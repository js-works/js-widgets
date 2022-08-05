import Props from './types/Props'
import Component from './types/Component'
import VElement from './types/VElement'
import VNode from './types/VNode'
import Key from './types/Key'

function h(
  type: string,
  props?: Omit<Props, 'key'> & { key?: Key | null } | null,
  ...children: VNode[]
): VElement<any>

function h<P extends Props = Props>(
  type: Component<P>,
  props?: Omit<Props, 'key'> & { key?: Key | null } | null,
  ...children: VNode[]
): VElement<P>

function h(/* arguments */): VElement<any> {
  const
    argCount = arguments.length,
    type = arguments[0],
    secondArg = arguments[1],

    skippedProps = argCount > 1 && secondArg !== undefined && secondArg !== null
        && (typeof secondArg !== 'object' || secondArg instanceof VirtualElement
          || typeof secondArg[SYMBOL_ITERATOR] === 'function' || Array.isArray(secondArg)),

    originalProps = skippedProps ? null : (secondArg || null),
    hasKey = !!originalProps && (originalProps.hasOwnProperty('key')),
    hasChildren = argCount > 2 || argCount === 2 && skippedProps,
    needsToCopyProps = hasChildren || hasKey

  let props: any = null

  if (needsToCopyProps) {
    props = {}

    for (const key in originalProps) {
      if (originalProps.hasOwnProperty(key) && key !== 'key') {
        if (key === 'children') {
          throw new Error('[createElement] Props must not have key "children" - pass children as arguments instead')
        }

        props[key] = originalProps[key]
      }
    }
  } else if (!originalProps && hasChildren) {
    props = {}
  } else {
    props = originalProps
  }

  if (hasChildren) {
    const firstChildIndex = skippedProps ? 1 : 2

    if (argCount === firstChildIndex + 1) {
      props.children = arguments[firstChildIndex]
    } else {
      const children: any[] = []

      for (let i = skippedProps ? 1 : 2; i < argCount; ++i) {
        children.push(arguments[i])
      }

      props.children = children
    }
  }

  let key = null

  if (hasKey) {
    key = originalProps.key
  }

  return new VirtualElement(type, props, key)
}

export default h

// --- locals -------------------------------------------------------

const
  SYMBOL_ITERATOR =
    typeof Symbol === 'function' && Symbol.iterator
      ? Symbol.iterator
      : '@@iterator'

const VirtualElement = class VirtualElement {
  type: string | Component
  props: Props | null
  key: Key

  constructor(
    type: string | Component,
    props: Props | null,
    key: Key
  ) {
    this.type = type
    this.props = props
    this.key = key
  }
}
