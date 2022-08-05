import { h, component } from '../../modules/core/main/index'
import { useOnMount, useOnUpdate, usePropsProxy } from '../../modules/hooks/main/index'
import { consume, componentActions, toProxy } from '../../modules/tools/main/index'
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

const useCounterActions = componentActions((state, setState) => {
  return {
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
      [props, getProps] = usePropsProxy(c, {
        initialValue: 0,
        label: 'Counter'
      }),

      [actions, getState] = useCounterActions(c, props.initialValue),
      state = toProxy(getState),
      use = consume(getProps, getState),

      onIncrement = () => actions.incrementCount(),
      onDecrement = () => actions.decrementCount()

    useOnMount(c, () => {
      console.log('Component has been mounted')

      return () => console.log('Component will be unmounted')
    })

    useOnUpdate(c, ()=> {
      console.log(`Component has been rendered - ${props.label}: ${state.count}`)
    })

    return use((props, state) => {
      return (
        <div>
          <label>{props.label}: </label> 
          <button onClick={onDecrement}>
            -
          </button>
          <span> {state.count} </span>
          <button onClick={onIncrement}>
            +
          </button>
        </div>
      )
    })
  }
})

export default <Counter/> 
