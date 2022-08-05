import {
  h as createDyoElement,
  useContext as useDyoContext,
  Context as DyoContext,
} from 'dyo'

import * as Spec from 'js-spec/validators'

import h from './h'
import component from './component'
import Context from './types/Context'
import VNode from './types/VNode'
import hasOwnProp from '../internal/hasOwnProp'
import setHiddenProp from '../internal/setHiddenProp'
import Component from './types/Component'

function context<T>(
  config: ContextConfig1<T>
): [Context<T>, Provider<T>] 

function context<T>(
  config: ContextConfig2<T>
): [Context<T>, Provider<T>] 

function context<T>(config: ContextConfig1<T> | ContextConfig2<T>):
  [Context<T>, Provider<T>] {
  
  if (process.env.NODE_ENV === 'development' as any) {
    const error = validateContextConfig(config)

    if (error) {
      const errorMsg =
        config
          && typeof config === 'object'
          && typeof config.name === 'string'
          && config.name.trim() !== ''
            ? `Illegal configuration for context "${config.name}" =>  ${error.message}`
            : `Illegal context configuration " =>  ${error.message}`

      throw new TypeError(errorMsg)
    }
  }
  
  const
    Provider = component({
      name: `ContextProvider:${config.name}`,

      ...process.env.NODE_ENV === 'development' as any && config.validate && {
        validate(props: any) {
          const illegalKeys = Object.keys(props).filter(it => it !== 'value' && it !== 'children')

          let errorMsg: string | null = null

          if (!hasOwnProp(props, 'value')) {
            errorMsg = "Must contain prop 'value'"
          } else if (illegalKeys.length > 0) {
            errorMsg = 'Illegal key(s): ' + illegalKeys.join(', ')
          } else {
            const result = config.validate!(props.value)

            if (result === false) {
              errorMsg = "Invalid property 'value'"
            } else if (result instanceof Error) {
              errorMsg = "Invalid property 'value' => " + result.message.trim()
            }
          }

          return errorMsg ? new TypeError(errorMsg) : null
        }
      },

      render(props: any): VNode { // TODO
        const { children, ...propsWithoutChildren } = props

        return h(Provider, propsWithoutChildren, ...children)
      }
    })

  const DyoProvider = ({ value, key, children }: any): any => { // TODO
    return createDyoElement(DyoContext, { value, key }, children)
  }

  setHiddenProp(Provider, '__type', DyoProvider)

  const
    constr = () => {},
    context = Object.create(constr.prototype) as Context<T>

  (context as any).meta = {
    type: 'context',
    name: config.name,
    validate: config.validate || null,
    default: config.default!
  }

  setHiddenProp(constr, '__type', DyoProvider)

  return [context, Provider]
}

// --- types --------------------------------------------------------

type ContextConfig1<T extends (any | undefined)> = {
  name: string,
  default?: T,
  validate?(value: T): boolean | null | Error
}

type ContextConfig2<T> = {
  name: string,
  default: T,
  validate?(value: T): boolean | null | Error
}

type ProviderProps<T> = {
  value: T,
  children?: VNode
}

type Provider<T> = Component<ProviderProps<T>>


// --- locals --------------------------------------------------------

const
  REGEX_CONTEXT_NAME = /^([a-zA-Z][a-zA-Z0-9]*:)*[A-Z][a-zA-Z0-9.]*$/,

  validateContextConfig = Spec.exact({
    name: Spec.match(REGEX_CONTEXT_NAME),
    default: Spec.optional(Spec.any),
    validate: Spec.optional(Spec.func)
  })

// --- exports ------------------------------------------------------

export default context
