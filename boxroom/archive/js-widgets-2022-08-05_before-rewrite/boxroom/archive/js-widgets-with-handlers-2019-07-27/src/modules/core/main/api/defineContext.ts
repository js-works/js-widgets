import ContextConfig from './types/ContextConfig'
import { Spec, SpecValidator } from 'js-spec'
import Context from './types/Context'
import VirtualElement from './types/VirtualElement'
import createElement from './createElement'

export default function defineContext<T>(config: ContextConfig<T>): Context<T> {
  let error: Error | null = null
  
  if (process.env.NODE_ENV === 'development' as any) {
    error = validateContextConfig(config)

    if (error) {
      throw new Error(`[defineContext] ${error.message}`)
    }
  }

  let
    createProvider: (...args: any[]) => VirtualElement = null!,
    createConsumer: (...args: any[]) => VirtualElement = null!

  let ret: Context<T> = new ContextClass(
    (...args: any[]) => {
      if (createProvider === null) {
        createProvider = createElement.bind(null, ret.Provider as any)
      }

      return createProvider(...args)
    },

    (...args: any[]) => {
      if (createConsumer === null) {
        createConsumer = createElement.bind(null, ret.Consumer)
      }

      return createConsumer(...args)
    }
  ) as any as Context<T>
  
  Object.defineProperty(ret.Provider, 'js-widgets:kind', {
    value: 'contextProvider'
  })
  
  Object.defineProperty(ret.Provider, 'context', {
    value: ret
  })

  Object.defineProperty(ret.Consumer, 'js-widgets:kind', {
    value: 'contextConsumer'
  })
  
  Object.defineProperty(ret.Consumer, 'context', {
    value: ret
  })
  
  Object.defineProperty(ret.Provider, 'meta', {
    value: Object.freeze({
      type: 'statelessComponent',
      displayName: `${config.displayName}.Provider`,
      render: ret.Provider
    }) 
  })

  Object.defineProperty(ret.Consumer, 'meta', {
    value: Object.freeze({
      type: 'statelessComponent',
      displayName: `${config.displayName}.Consumer`,
      render: ret.Provider
    }) 
  })

  return ret
}

// --- locals -------------------------------------------------------

const REGEX_DISPLAY_NAME = /^([a-z]+:)*[A-Z][a-zA-Z0-9.]*$/

let contextConfigSpec: SpecValidator = null!

if (process.env.NODE_ENV === 'development' as any) {
  contextConfigSpec =
    Spec.exact({
      displayName: Spec.match(REGEX_DISPLAY_NAME),
      validate: Spec.optional(Spec.function),
      default: Spec.any
    })
}

function validateContextConfig<T>(config: ContextConfig<T>): Error | null {
  let ret = null

  const error = contextConfigSpec.validate(config)

  if (error) {
    let errorMsg = 'Invalid configuration for context'

    if (config && typeof config.displayName === 'string'
      && config.displayName.match(config.displayName)) {
      
      errorMsg += ` "${config.displayName}"`
    }

    errorMsg += ` => ${error.message}`

    ret = new Error(errorMsg)
  }

  return ret
}

const ContextClass = class Context {
  constructor(provider: any, consumer: any ) {
    Object.defineProperty(this, 'Provider', {
      value: provider
    })
    
    Object.defineProperty(this, 'Consumer', {
      value: consumer
    })
  }
}
