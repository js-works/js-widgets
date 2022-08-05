import { component as baseComponent, Component, Props, VirtualNode, Ctrl }
  from '../../../core/main/index'

function component<
  P extends Props = {},
  D extends Defaults<P> = {}
>(
  config: StatelessConfig<P, D>
): Component<P>

function component<
  P extends Props = {},
  D extends Defaults<P> = {}
>(
  displayName: string,
  config: Omit<StatelessConfig<P, D>, 'displayName'>
): Component<P>

function component<
  P extends Props = {},
  D extends Defaults<P> = {}
>(
  config: StatefulConfig<P, D>
): Component<P>

function component<
  P extends Props = {},
  D extends Defaults<P> = {}
>(
  displayName: string,
  config: Omit<StatefulConfig<P, D>, 'displayName'>
): Component<P>

function component<P extends Props>(
  displayName: string,
  render: (props: P) => VirtualNode
): Component<P>

function component<P extends Props = {}>(
  config: BaseStatefulComponentConfig<P>
): Component<P>

function component<P extends Props = {}>(
  displayName: string,
  config: Omit<BaseStatefulComponentConfig<P>, 'displayName'>
): Component<P>

function component<P extends Props>(arg1: any, arg2?: any): Component<P> {
  if (arg1 && typeof arg1 === 'object' && arg1.init
    || typeof arg1 === 'string' && arg2 && arg2.init) {

    return baseComponent(arg1, arg2)
  }

  if (process.env.NODE_ENV === 'development' as any) {
    let errorMsg = ''

    if (typeof arg1 === 'string') {
      if (typeof arg2 === 'function') {
        // nothing wrong with a function as second argument
      } else if (!arg2 || typeof arg2 !== 'object') {
        errorMsg = 'Second parameter must be an object or an function'
      } else if ('displayName' in arg2) {
        errorMsg = "Second argument must not contain key 'displayName'"
      }
    } else if (!arg1 || typeof arg1 !== 'object') {
      errorMsg = 'First argument must either be a string or an object'
    } else if (arg2 !== undefined) {
      errorMsg = 'Illegal second argument (expected undefined)'
    }

    if (errorMsg) {
      throw new TypeError(`Illegal arguments: ${errorMsg}`)
    }
  }

  let config: any

  if (typeof arg1 === 'string' && typeof arg2 === 'function') {
    config = {
      displayName: arg1,
      render: arg2
    }
  } else if (arg1.render) {
    config = Object.assign({}, arg1)
  } else {
    const
      options =
        typeof arg1 !== 'string' ? arg1 : { ...arg2, displayName: arg1 },

      defaultProps = options.defaultProps || {},

      init = (c: Ctrl, getProps: () => P) => {
        const
          getDefaultedProps = () => {
            // TODO - optimize
            return Object.assign({}, defaultProps, getProps())
          },

          $props = copyProperties({} as any, getDefaultedProps()),
          render = options.main(c, $props)

        return () => {
          const currentProps = getDefaultedProps()
  
          copyProperties($props, currentProps, true)
          return render(currentProps)
        }
      }

    config = { ...options, init }
    delete config.defaultProps
    delete config.main
  }

  return baseComponent(config)
}

// --- locals -------------------------------------------------------

type StatelessConfig<
  P extends Props,
  D extends Defaults<P>
 >  = {
  displayName: string,
  memoize?: boolean,
  validate?(props: P): boolean | null | Error,
  defaultProps?: D,
  render(props: P & D): VirtualNode
}

type StatefulConfig<
  P extends Props,
  D extends Defaults<P>
>  = {
  displayName: string,
  memoize?: boolean,
  validate?(props: P): boolean | null | Error,
  defaultProps?: D,
  
  main(c: Ctrl, props: P & D): (props: P) => VirtualNode
}

type BaseStatefulComponentConfig<P extends Props = {}> = {
  displayName: string,
  memoize?: boolean,
  validate?: ((props: P) => boolean | null | Error) | null,
  init: (c: Ctrl, getProps: () => P) => (props: P) => VirtualNode,
}

function noOp() {
}

const emptyObject = Object.freeze({})

const getEmptyObject = () => emptyObject

function copyProperties<T extends object>(
  target: T,
  source: T,
  cleanBefore = false
) {
  if (cleanBefore) {
    for (const key in target) {
      delete target[key]
    }
  }

  const keys = Object.keys(source)

  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i]

    ;(target as any)[key] = (source as any)[key as any]
  }

  return target
}

type PickOptionalProps<T> = Pick<T, {
   [K in keyof T]: T extends Record<K, T[K]> ? never : K
}[keyof T]>

type Defaults<P extends Props> = Partial<PickOptionalProps<P>>

// --- exports ------------------------------------------------------

export default component