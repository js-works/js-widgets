import * as Spec from 'js-spec/validators'

import h from './h'
import component from './component'
import createInternalContext from '../internal/adapt/createContext'
import Context from './types/Context'
import VirtualNode from './types/VirtualNode'
import ContextConfig from '../internal/types/ContextConfig'
import ContextProviderProps from '../internal/types/ContextPrividerProps'
import ContextConsumerProps from '../internal/types/ContextConsumerProps'

function context<T>(
  config: ContextConfig<T>
): Context<T> 

function context<T>(
  displayName: string,
  config?: Omit<ContextConfig<T>, 'displayName'>
): Context<T> 

function context(arg1: any, arg2?: any): Context<any> {
  if (process.env.NODE_ENV === 'development' as any) {
    let errorMsg = ''

    if (typeof arg1 === 'string') {
      if (typeof arg2 ===  undefined) {
        // nothing wrong with undefined as second argument
      } else if (!arg2 || typeof arg2 !== 'object') {
        errorMsg = 'Second parameter must be an object or undefined'
      } else if ('displayName' in arg2) {
        errorMsg = "Second argument must not contain key 'displayName'"
      }
    } else if (!arg1 || typeof arg1 !== 'object') {
      errorMsg = 'First argument must either be a string or an object'
    } else if (arg2 !== undefined) {
      errorMsg = 'Illegal second argument (expected undefined)'
    }

    if (errorMsg) {
      throw new TypeError(`[context] ${errorMsg}`)
    }
  }

  let config: any

  if (typeof arg1 === 'string') {
    config = { ...(arg2 || {}), displayName: arg1 }
  } else {
    config = arg1
  }

  return createContext(
    config.displayName,
    config.defaultValue,
    config.validate)
}

// --- private ------------------------------------------------------

function createContext<T>(
  displayName: string,
  defaultValue?: T,
  validate?: (it: T) => boolean | null | Error
): Context<T> {
  const
    providerConfig: any = {
      displayName: `ContextProvider (${displayName})`,

      render(props: any): VirtualNode {
        const { children, ...props2 } = props

        return h(Provider as any, props2, ...children)
      }
    },

    consumerConfig: any = {
      displayName: `ContextConsumer (${displayName})`,

      render(props: any): VirtualNode {
        const { children, ...props2 } = props

        return h(Consumer as any, props2, ...children)
      }
    }
    
    if (validate && process.env.NODE_ENV === 'development' as any) {
      providerConfig.validate = Spec.exact({
        value: validate
      })

      consumerConfig.validate = Spec.exact({
      })
    }

  const
    Provider = component<ContextProviderProps<T>>(providerConfig),
    Consumer = component<ContextConsumerProps<T>>(consumerConfig)

  const internalContext = createInternalContext(defaultValue)

  Object.defineProperty(Provider, '__internal_context', {
    value: internalContext
  })

  Object.defineProperty(Provider, '__internal_type', {
    value: internalContext.Provider
  })
  
  Object.defineProperty(Provider, '__internal_defaultValue', {
    value: defaultValue
  })
  
  Object.defineProperty(Consumer, '__internal_type', {
    value: internalContext.Consumer
  })

  return Object.freeze({ Provider, Consumer }) as any // TODO
}

// --- exports ------------------------------------------------------

export default context
