import { createElement, VirtualElement, Context, Fragment } from '../../../core/main/index'
import React from 'react' 
import ReactDOM from 'react-dom'

const { useState, useEffect, useRef, useContext } = React as any

Object.defineProperty(Fragment, '__internal_type', {
  value: React.Fragment
})

const
  VirtualElementClass = createElement('div').constructor,

  SYMBOL_ITERATOR =
    typeof Symbol === 'function' && Symbol.iterator
      ? Symbol.iterator
      : '@@iterator'

function isElement(it: any) {
  return it instanceof VirtualElementClass
}

function isIterableObject(it: any): boolean {
  return typeof it === 'object' && (Array.isArray(it) || typeof it[SYMBOL_ITERATOR] === 'function')
}



export default function mount(element: VirtualElement, container: Element | string) { 
  if (!isElement(element)) {
    throw new TypeError(
      '[mount] First argument "element" must be a virtual element')
  }

  if (!container || (typeof container !== 'string' && !container.tagName)) {
    throw new TypeError(
      '[mount] Second argument "container" must be a DOM element or the id of the corresponding DOM element')
  }

  const target =
    typeof container === 'string'
      ? document.getElementById(container)
      : container

  if (!target) {
    throw new TypeError(
      `[mount] Could not find container DOM element with id "${container}"`)
  }

  ReactDOM.render(convertNode(element), target)
}

function adjustEntity(it: any): void {
  const kind: string = it['js-widgets:kind'] 

  switch (kind) {
    case 'componentFactory':
      if (it.meta.render) {
         convertStatelessComponent(it)
      } else {
         convertStatefulComponent(it)
      }

      break

    case 'contextConsumer':
      convertContext(it.context)
      break
    
    case 'contextProvider':
      convertContext(it.context)
      break
  }
}

function convertNode(node: any) {
  if (isIterableObject(node)) {
    return convertNodes(node)
  } else if (!isElement(node)) {
    return node
  }

  const
    type = node.type,
    props = node.props,
    children = props ? props.children || null : null,
    newChildren = children ? convertNodes(children) : null

  if (type && type['js-widgets:kind'] && !type.__internal_type) {
    adjustEntity(type)
  }

  const
    newType = typeof type === 'function' && type.__internal_type ? type.__internal_type : type
  
  let newProps = props ? { ...props } : null

  if (newChildren && newChildren !== children) {
    newProps.children = newChildren
  }

  if (type && type['js-widgets:kind'] === 'contextConsumer' && newProps.children && typeof newProps.children[0] === 'function') { 
    const consume = newProps.children[0]
    newProps.children[0] = (value: any) => convertNode(consume(value))
  }

  let ret = null

  // TODO - optimize

  if (newProps) {
    delete newProps.key
  }

  if (node.key !== null || node.ref !== null) {
    newProps = newProps ? Object.assign({}, newProps) : {}

    if (node.key !== undefined && node.key !== null) {
      newProps.key = node.key
    }

    if (node.ref !== undefined && node.ref !== null) {
      newProps.ref = node.ref
    }
  }

  if (!newProps || !newProps.children) {
    ret = React.createElement(newType, newProps)
  } else {
    const
      children = newProps.children,
      childCount = newProps.children.length,
      newArgs = new Array(childCount + 2)

    delete newProps.children
    newArgs[0] = newType
    newArgs[1] = newProps

    for (let i = 0; i < childCount; ++i) {
      newArgs[i + 2] = children[i]
    }

    ret = React.createElement.apply(null, newArgs)
  }

  return ret
}

function convertNodes(elements: any[]) {
  const ret = [...elements]

  for (let i = 0; i < elements.length; ++i) {
    const child = elements[i]

    if (isElement(child)) {
      ret[i] = convertNode(child)
    } else if (isIterableObject(child)) {
      ret[i] = convertNodes(child)
    }
  }

  return ret
}

export function convertContext(it: any): any {
  const ret =
    it.Provider.__internal_type && it.Provider.__internal_type._context
      || it.Consumer.__internal_type && it.Consumer.__internal_type._context
      || React.createContext(it.Provider.meta.default)
  
  // TODO

  if (!it.Provider.__internal_type) {
    Object.defineProperty(it.Provider, '__internal_type', {
      value: ret.Provider
    })
  }

  if (!it.Consumer.__internal_type) {
    Object.defineProperty(it.Consumer, '__internal_type', {
      value: ret.Consumer
    })
  }

  return ret
}

function convertStatelessComponent(it: any): Function {
  let ret: any = (props: any, ref: any = null) => {
    props = mergeDefaultProps(props, it)

    if (ref) {
      props.ref = ref
    }
    
    return convertNode(it.meta.render(props))
  }

  ret.displayName = it.meta.displayName
  ret = React.forwardRef(ret)

  if (it.meta.memoize) {
    ret = React.memo(ret)
  }

  Object.defineProperty(it, '__internal_type', {
    value: ret
  })

  return ret
}

function convertStatefulComponent(it: any): Function {
  let ret = function StatefulComponent(props: any, ref: any) {
    props = mergeDefaultProps(props, it)

    if (ref) {
      props.ref = ref
    }

    const
      [, setForceUpdateValue] = useState(false),
      currPropsRef = useRef(props),
      getProps = useRef(() => currPropsRef.current).current,
      isMountedRef = useRef(false),
      states: any[] = useRef([]).current,
      contexts: any[] = useRef([]).current,
      updateListeners: (() => void)[] = useRef([]).current,
      disposeListeners: (() => void)[] = useRef([]).current,

      component = useRef({
        getProps() {
          return currPropsRef.current
        },

        handleState(initialState: any) {
          const idx = states.length

          states[idx] = [initialState, null]

          return [() => states[idx][0], (init: any) => {
            states[idx][0] = init
            
            if (isMountedRef.current) {
              states[idx][1](init)
            }
          }]
        },

        consumeContext(context: any) {
          const idx = contexts.length

          if (!context.Provider.__internal_type) {
            convertContext(context)
          }

          contexts[idx] = [undefined, context]

          return () => contexts[idx][0]
        },

        forceUpdate() {
          return setForceUpdateValue((it: boolean) => !it)
        },

        isMounted() {
          return isMountedRef.current
        },

         onUpdate(listener: () => void): () => void {
           const subscriber = () => listener()

           updateListeners.push(subscriber)

           return () => {
              const idx = updateListeners.indexOf(subscriber)
              updateListeners.splice(idx, 1)
           }
         },

         onUnmount(listener: () => void): () => void {
           const subscriber = () => listener()

           disposeListeners.push(subscriber)

           return () => {
              const idx = disposeListeners.indexOf(subscriber)
              disposeListeners.splice(idx, 1)
           }
         }
      }).current,

    renderRef = useRef(null)
    currPropsRef.current = props

    useEffect(() => {
      isMountedRef.current = true

      const listeners = [...updateListeners]

      listeners.forEach(
        listener => listener())
    })

    useEffect(() => {
      const listeners = [...disposeListeners]

      return () => listeners.forEach(
        listener => listener()) 
    }, [])

    if (!renderRef.current) {
      renderRef.current = it.meta.init(component, getProps)
    }

    states.forEach(item => {
      const [value, setValue] = useState(item[0])

      item[0] = value
      item[1] = setValue
    })

    contexts.forEach(item => {
      const value = useContext(item[1].Provider.__internal_type._context)
      item[0] = value
    })

    return convertNode(renderRef.current(props))
  }
  
  ;(ret as any).displayName = it.meta.displayName

  ret = React.forwardRef(ret)

  if (it.meta.memoize) {
    ret = React.memo(ret)
  }
  
  Object.defineProperty(it, '__internal_type', {
    value: ret
  })

  return ret
}

function mergeDefaultProps(props: any, type: any) {
  let ret: any = {} 
  
  if (type && type.meta) {
    if (type.meta.defaults) {
      Object.assign(ret, type.meta.defaults)
    }
  }

  Object.assign(ret, props)
  
  return ret
}
