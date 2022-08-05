import Props from './types/Props'
import ComponentMeta from './types/ComponentMeta'
import ComponentFactory from './types/ComponentFactory'
import createElement from './createElement'
import StatelessComponentConfig from './types/StatelessComponentConfig' 
import StatefulComponentConfig from './types/StatefulComponentConfig' 

import { Spec } from 'js-spec'

function defineComponent<P extends Props = {}>(config: StatelessComponentConfig<P>):
  ComponentFactory<P>

function defineComponent<P extends Props = {}>(config: StatefulComponentConfig<P>):
  ComponentFactory<P>

function defineComponent<P extends Props = {}>(
  config: StatefulComponentConfig<P> | StatelessComponentConfig<P>
): ComponentFactory<P> {

  if (process.env.NODE_ENV === 'development' as any) {
    const error = validateComponentConfig(config)

    if (error) {
      throw new Error(
        `[defineComponent] ${error.message}`)
    }
  }

  let createComponentElement: Function | null = null

  const ret: ComponentFactory<P> =
    Object.assign(
      function (/* arguments */) {
        return createComponentElement!.apply(null, arguments)
      },
      {
        meta: null! as  ComponentMeta<P>
      })
  
  createComponentElement = createElement.bind(null, ret as any)

  Object.defineProperty(ret, 'js-widgets:kind', {
    value: 'componentFactory'
  })

  Object.defineProperty(ret, 'meta', {
    value: convertConfigToMeta(config)
  })

  return ret
}

export default defineComponent

// --- locals ---------------------------------------------------

const
  REGEX_DISPLAY_NAME = /^([a-z]+:)*[A-Z][a-zA-Z0-9.]*$/,
  REGEX_PROP_NAME = /^[a-z][a-zA-Z0-9]*$/,

  specOfDisplayName = 
    Spec.match(REGEX_DISPLAY_NAME),

  specOfDefaultProps =
    Spec.and(
      Spec.object,
      Spec.hasSomeKeys,
      Spec.keysOf(Spec.match(REGEX_PROP_NAME))),

  specOfComponentConfig =
    Spec.or(
      {
        when: Spec.hasOwnProp('render'),
        
        then: Spec.exact({
          displayName: specOfDisplayName,
          defaults: Spec.optional(specOfDefaultProps),
          validate: Spec.optional(Spec.function),
          memoize: Spec.optional(Spec.boolean),
          render: Spec.function
        })
      }, 
      {
        when: Spec.hasOwnProp('init'),

        then: Spec.exact({
          displayName: specOfDisplayName,
          defaults: Spec.optional(specOfDefaultProps),
          validate: Spec.optional(Spec.function),
          memoize: Spec.optional(Spec.boolean),
          init: Spec.function
        })
      })

function validateComponentConfig(config: any): null | Error {
  let ret = null
  const error = specOfComponentConfig.validate(config)

  if (error) {
    let errorMsg = 'Invalid configuration for component'

    if (config && typeof config.displayName === 'string'
      && config.displayName.match(REGEX_DISPLAY_NAME)) {

      errorMsg += ` "${config.displayName}"`
    }

    errorMsg += ` => ${error.message}`

    ret = new Error(errorMsg)
  }

  return ret
}

function convertConfigToMeta(config: any): any {
  const ret: any = {
    displayName: config.displayName,
    validate: config.validate || null,
    memoize: !!config.memoize
    // plus key "render" or "init"
  }

  if (config.defaults) {
    const keys = Object.keys(config.defaults)

    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i]

      ret.defaults[key] = config.defaults[key]
    }

    Object.freeze(ret.defaults)
  }

  if (config.render) {
    ret.render = config.render
  } else {
    ret.init = config.init
  }

  return Object.freeze(ret)
}
