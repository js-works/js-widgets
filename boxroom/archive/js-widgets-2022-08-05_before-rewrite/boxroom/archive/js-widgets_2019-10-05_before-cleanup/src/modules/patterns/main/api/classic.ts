import { component, Component, Props, VirtualNode, Ctrl, Context } from '../../../core/main/index'
import usePropsProxy from '../../../hooks/main/api/usePropsProxy'
import useStateProxy from '../../../hooks/main/api/useStateProxy'

function classic<P extends Props, S extends State, D extends P>(
  config: StatelessConfig<P, S, D>
): Component<P>

function classic<P extends Props, S extends State, D extends P>(
  displayName: string,
  config: Omit<StatelessConfig<P, S, D>, 'displayName'>
): Component<P>

function classic<P extends Props, S extends State, D extends P, C extends ContextFields>(
  config: StatefulConfig<P, S, D, C>
): Component<P>

function classic<P extends Props, S extends State, D extends P, C extends ContextFields>(
  displayName: string,
  config: Omit<StatefulConfig<P, S, D, C>, 'displayName'>
): Component<P>

function classic<P extends Props>(
  displayName: string,
  render: (props: P) => VirtualNode
): Component<P>

function classic<P extends Props>(arg1: any, arg2?: any): Component<P> {
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
  } else {
    const
      options =
        typeof arg1 !== 'string' ? arg1 : { ...arg2, displayName: arg1 },

      defaultProps = options.defaultProps || {},
      initState = options.initState || (() => ({})),

      init = (rawC: Ctrl<any>) => {
        let c = rawC

        if (options.defaultProps) {
          c = { ...rawC }

          c.consumeProps = () => {
            const
               getRawProps = rawC.consumeProps(),
               getProps = () => Object.assign({}, defaultProps, getRawProps())

            return getProps
          }
        }

        let getContext: () => any 
        
        if (!options.context) {
          getContext = () => ({}) // TODO
        } else {
          const
            ctxArr: any = [],
            keys = Object.keys(options.context)

          for (let i = 0; i < keys.length; ++i) {
            const key = keys[i]
            let getter: Function

            if (typeof options.context[key] === 'function') {
              getter = options.context[key](c)
            } else {
              getter = c.consumeContext(options.context[key])
            }

            ctxArr.push([key, getter])
          }

          getContext = () => {
            const context: any = {}


            for (let i = 0; i < ctxArr.length; ++i) {
              const [key, getter] = ctxArr[i]

              context[key] = getter()
            }

            return context
          }
        }
        
        // TODO !!!!!
        const
          initialContext = getContext(), // TODO clear
          getProps = c.consumeProps(),
          [getState, setState] = c.handleState(initState(getProps(), initialContext))

        const 
          update = setState, // TODO!! - force upate!
          self: any = { props: getProps(), state: getState(), context: initialContext }, 
          render = options.main(c,  self, update)

        return () => {
          self.props = getProps()
          self.state = getState()
          self.context = getContext()
          return render(self.props, self.state, self.context)
        }
      }

    config = { ...options, init }
    delete config.defaultProps
    delete config.context
    delete config.initState
    delete config.main
  }

  return component(config)
}

// --- locals -------------------------------------------------------

type State = Record<string, any>

type ContextFields =
  Record<string, Context<any> | ((c: Ctrl) => () => any)>

type ContextValues<C extends ContextFields> = {
  [K in keyof C]: C[K] extends Context<infer T>
    ? T
    : C[K] extends ((c: Ctrl) => () => infer T)
    ? T
    : never
} 

type StatelessConfig<P extends Props, S extends State, D extends P>  = {
  displayName: string,
  memoize?: boolean,
  validate?(props: P): boolean | null | Error,
  defaultProps?: D,
  initState?(props: P & D): S,
  render(props: P & D): VirtualNode
}

type StatefulConfig<P extends Props, S extends State, D extends P, C extends ContextFields>  = {
  displayName: string,
  memoize?: boolean,
  validate?(props: P): boolean | null | Error,
  defaultProps?: D
  context?: C,
  initState?(props: P & D, context: ContextValues<C>): S,
  
  main(
    c: Ctrl<P & D>,

    self: {
      props: P & D,
      state: S,
      context: ContextValues<C>
    },

    update: (updater: Partial<S> | ((s: S) => Partial<S>)) => void
  ): (props: P, state: S, ctx: ContextValues<C>) => VirtualNode
}

function noOp() {
}

// --- exports ------------------------------------------------------

export default classic