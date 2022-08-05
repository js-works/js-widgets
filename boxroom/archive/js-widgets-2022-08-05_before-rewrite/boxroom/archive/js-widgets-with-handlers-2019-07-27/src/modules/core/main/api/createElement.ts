import { Spec } from 'js-spec'
import ComponentFactory from './types/ComponentFactory'
import VirtualElement from './types/VirtualElement'
import Props from './types/Props'
import Key from './types/Key'

function createElement(type: string | ComponentFactory, props?: Props | null, ...children: any[]): VirtualElement
function createElement(/* arguments */): VirtualElement {
  const
    argCount = arguments.length,
    type = arguments[0],
    secondArg = arguments[1],

    skippedProps = argCount > 1 && secondArg !== undefined && secondArg !== null
        && (typeof secondArg !== 'object' || secondArg instanceof VirtualElementClass
          || typeof secondArg[Symbol.iterator] === 'function'),

    originalProps = skippedProps ? null : (secondArg || null),
    hasChildren = argCount > 2 || argCount === 2 && skippedProps,
    needsToCopyProps = hasChildren || (originalProps && (originalProps.key !== undefined /*|| originalProps.ref !== undefined */))

  let
    props: Props | null = null,
    children: any[] | null = null

  if (needsToCopyProps) {
    if (!props) {
      props = {}
    }
  }

  if (hasChildren) {
    children = []

    for (let i = 2 - (skippedProps ? 1 : 0); i < argCount; ++i) {
      const child: any = arguments[i]

      if (isIterableObject(child)) {
        pushItems(children, child)
      } else {
        children.push(child)
      }
    }
  }

  if (argCount > 1 && !skippedProps) {
    if (!hasChildren) {
      props = secondArg
    } else if (!secondArg) {
      props = { children }
    } else {
      props = {}

      const keys = Object.keys(secondArg)

      for (let i = 0; i < keys.length; ++i) {
        const key = keys[i]
        
        props[key] = secondArg[key] 
      }

      props.children = children
    }
  } else if (hasChildren) {
    props = { children }
  }

  let error: Error | null = null

  if (process.env.NODE_ENV === 'development' as any) {
    if (type && type.meta && type.meta.validate) {
      if (type['js-widgets:kind'] !== 'contextProvider') {
        error = validateComponentProps(props, type.meta.validate, type.meta.displayName)
      } else {
        error = validateContextProps(props, type.meta.validate, type.meta.displayName)
      }

      if (error) {
        throw error
      }
    }
  }

  let
    key = null

  // TODO - fix!!!!
  if (originalProps && (originalProps.key !== undefined /* || originalProps.ref !== undefined */)) {
    props = Object.assign({}, props)
    delete props.key
    key = originalProps.key === undefined ? null : originalProps.key
  }

  return new VirtualElementClass(type, props, key)
}

export default createElement

// --- locals -------------------------------------------------------

const
  SYMBOL_ITERATOR =
    typeof Symbol === 'function' && Symbol.iterator
      ? Symbol.iterator
      : '@@iterator'

const VirtualElementClass = class VirtualElement {
  type: string | ComponentFactory
  props: Props | null
  key: Key

  constructor(
    type: string | ComponentFactory,
    props: Props | null,
    key: Key,
  ) {
    this.type = type
    this.props = props
    this.key = key
  }
}

function pushItems(array: any[], items: Iterable<any>) {
  if (Array.isArray(items)) {
    for (let i = 0; i < items.length; ++i) {
      const item = items[i]

      if (isIterableObject(item)) { 
        pushItems(array, item)
      } else {
        array.push(item)
      }
    }
  } else {
    for (const item of items) {
      if (isIterableObject(item)) {
        pushItems(array, item)
      } else {
        array.push(item)
      }
    }
  }
}

function isIterableObject(it: any) {
  return it !== null && typeof it === 'object' && (Array.isArray(it) || typeof it[SYMBOL_ITERATOR] === 'function')
}

function validateComponentProps<P extends Props>(
  props: P | null,
  validate: (props: P | null) => boolean | null | Error,
  displayName: string
): null | Error {
  let
    ret = null,
    errorMsg: string | null = null

  if (validate) {
    const result = validate(props)

    if (result === false) {
      errorMsg = 'Invalid component properties'
    } else if (result instanceof Error) {
      errorMsg = result.message
    } else if (result !== null && result !== true) {
      errorMsg = 'Invalid return value from prop validation function'
    }

    if (errorMsg) {
      ret = new Error(
        'Prop validation error for component '
          + `"${displayName}"`
          + ' => '
          + errorMsg)
    }
  }

  return ret
}

function validateContextProps<P extends Props>(
  props: P | null,
  validate: (props: P | null) => boolean | null | Error,
  displayName: string
): null | Error {
  let
    ret = null,
    errorMsg: string | null = null

  const clone: any = { ... props }

  delete clone.key
  delete clone.value

  const keys = Object.keys(clone)

  if (keys.length > 0) {
    errorMsg = 'Invalid keys: ' + keys.join(', ')
  }

  if (!errorMsg && validate) {
    const result = validate(props && props.value)

    if (result === false) {
      errorMsg = 'Invalid context value'
    } else if (result instanceof Error) {
      errorMsg = result.message
    } else if (result !== null && result !== true) {
      errorMsg = 'Invalid return value from context validation function'
    }

    if (errorMsg) {
      ret = new Error(
        'Prop validation error for context '
          + `"${displayName}"`
          + ' => '
          + errorMsg)
    }
  }

  return ret
}
