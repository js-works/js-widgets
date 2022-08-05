import { h, component } from '../../modules/core/main/index'
import { useOnMount, useOnUpdate, usePropsProxy } from '../../modules/hooks/main/index'
import { componentStore, toProxy } from '../../modules/tools/main/index'
import { Spec } from 'js-spec'

type CounterProps = {
  initialValue?: number,
  label?: string
}

type CounterState = {
  count: number
}

function initCounterState(initialValue: number): CounterState {
  return { count: initialValue }
}

const useCounterStore = componentStore((state, setState) => {
  return {
    getCount() {
      return state.count
    },
  
    incrementCount() {
      setState({ count: state.count + 1 })
    },

    decrementCount() {
      setState({ count: state.count - 1 })
    }
  }
}, initCounterState)

const Counter = component<CounterProps>({
  displayName: 'Counter',
  memoize: true,

  validate: Spec.checkProps({
    optional: {
      initialValue: Spec.integer,
      label: Spec.string
    }
  }),

  init(c) {
    const
      [props] = usePropsProxy(c, {
        initialValue: 0,
        label: 'Counter'
      }),

      store = useCounterStore(c, props.initialValue),

      onIncrement = () => store.incrementCount(),
      onDecrement = () => store.decrementCount()

    useOnMount(c, () => {
      console.log('Component has been mounted')

      return () => console.log('Component will be unmounted')
    })

    useOnUpdate(c, ()=> {
      console.log(`Component has been rendered - ${props.label}: ${store.getCount()}`)
    })

    return () => {
      return (
        <div>
          <label>{props.label}: </label> 
          <button onClick={onDecrement}>
            -
          </button>
          <span> {store.getCount()} </span>
          <button onClick={onIncrement}>
            +
          </button>
        </div>
      )
    }
  }
})

export default <Counter/> 
