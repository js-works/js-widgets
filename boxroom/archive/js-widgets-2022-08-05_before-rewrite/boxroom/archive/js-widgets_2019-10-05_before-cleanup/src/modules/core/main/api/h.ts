import createElement from '../internal/adapt/createElement'
import isValidElement from '../internal/adapt/isValidElement'
import Component from './types/Component'
import VirtualElement from './types/VirtualElement'
import Props from './types/Props'

function h(type: string | Component, props?: Props | null, ...children: any[]): VirtualElement

function h(/* arguments */): any {
  // TODO - we can do better here
  if (arguments.length >= 2) {
    const
      sndArg = arguments[1],
      sndArgType = typeof sndArg

    if (sndArg && sndArgType === 'object') {
      if (isValidElement(sndArg) || Array.isArray(sndArg)
        || typeof sndArg[Symbol.iterator] === 'function'
        || typeof sndArg.then === 'function') {
        
        const [first, ...rest] = arguments

        return h(first, null, ...rest)
      }
    }
  }

  const
    type: any = arguments[0],
    internalType = type && type.__internal_type

  if (process.env.NODE_ENV === 'development' as any) {
    const
      arg2 = arguments[1]
    
    if (typeof type === 'function' && type.meta && type.meta.validate) {
      let props: any = null

      if (arg2 && typeof arg2 === 'object'
        && !isValidElement(arg2) && !isIterable(arg2)) {
        
        props = arg2
      }

      if (!props) {
        props = {}
      } else if (props.__source) {
        // Babel plugin "plugin-transform-react-jsx-source" adds additional
        // pseudo prop "__source" - let's remove it
        props = { ...props }
        delete props.__source
      }

      let error: Error | null =
        validateComponentProps(props, type.meta.validate, type.meta.displayName)

      if (error) {
        throw new Error(
          `Props validation failed for component "${type.meta.displayName}" => `
            + error.message) 
      }
    }
  }

  if (internalType !== undefined) {
    arguments[0] = internalType
  }

  return createElement.apply(null, arguments as any)
}

function validateComponentProps(
  props: Props,
  validate: (it: any) => boolean | null | Error,
  displayName: string
): null | Error {
  const result = validate(props)

  let errorMsg: string | null = null

  if (result === false) {
    errorMsg = 'Invalid props'
  } else if (result instanceof Error && result.message) {
    errorMsg = result.message
  }

  return !errorMsg
    ? null
    : new Error(errorMsg)
}

function isIterable(it: any) {
  return it && typeof it === 'object'
    && (Array.isArray(it) || typeof it[Symbol.iterator] === 'function')
}

export default h
