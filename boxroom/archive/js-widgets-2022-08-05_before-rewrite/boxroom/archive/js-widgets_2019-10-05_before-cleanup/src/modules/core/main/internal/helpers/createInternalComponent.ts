import StatelessComponentConfig from '../types/StatelessComponentConfig'
import StatefulComponentConfig from '../types/StatefulComponentConfig'
import memo from '../../internal/adapt/memo'
import useContext from '../../internal/adapt/useContext'
import useEffect from '../../internal/adapt/useEffect'
import useRef from '../../internal/adapt/useRef'
import useState from '../../internal/adapt/useState'

function createInternalComponent(
  componentConfig: StatelessComponentConfig<any>
): any

function createInternalComponent(
  componentConfig: StatelessComponentConfig<any>
): any

function createInternalComponent(
  componentConfig: any 
) {
  return (componentConfig as any).render
    ? createStatelessInternalComponent(componentConfig)
    : createStatefulInternalComponent(componentConfig)
}

export default createInternalComponent

// ------------------------------------------------------------------

function createStatelessInternalComponent(
  config: StatelessComponentConfig<any>
): Function {
  let ret: any = config.render.bind(null)

  ret.displayName = config.displayName

  if (config.memoize) {
    ret = memo(ret)
  }

  return ret
}

function createStatefulInternalComponent(
  config: StatefulComponentConfig<any>
): Function {
  let ret = function StatefulComponent(props: any) {

    const
      currPropsRef = useRef(props),
      getProps = useRef(() => currPropsRef.current).current,
      isMountedRef =  useRef(false),
      states: any[] = useRef([]).current,
      contexts: any[] = useRef([]).current,
      updateListeners: (() => void)[] = useRef([]).current,
      disposeListeners: (() => void)[] = useRef([]).current,

      ctrl = useRef({
        consumeProps() {
          return () => currPropsRef.current 
        },

        handleState(initialState: any) {
          const idx = states.length

          states[idx] = [initialState, null]

          return [() => states[idx][0], (updater: any) => {
            states[idx][0] =
              typeof updater === 'function'
                ? updater(states[idx][0])
                : updater
            
            if (isMountedRef.current) {
              states[idx][1](updater)
            }
          }]
        },

        consumeContext(context: any) {
          const idx = contexts.length

          contexts[idx] = [context.Provider.__internal_defaultValue, context.Provider.__internal_context]

          return () => {
            return contexts[idx][0]
          }
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
      renderRef.current = config.init(ctrl as any) as any // TODO!!!
    }

    states.forEach(item => {
      const [value, setValue] = useState(item[0])

      item[0] = value
      item[1] = setValue
    })

    contexts.forEach(item => {
      try {
        item[0] = useContext(item[1])
      } catch {
        // TODO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      }
    })

    return (renderRef as any).current(props) // TODO
  }
  
  ;(ret as any).displayName = config.displayName

  if (config.memoize) {
    ret = memo(ret)
  }

  return ret
}

