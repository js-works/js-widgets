import { h, component, useOnMount, useOnUpdate, Component }
  from '../../modules/root/main/index'

import { Spec } from 'js-spec'

type CounterProps = {
  initialValue?: number,
  label?: string
}

function initCounterState(props: { initialValue: number }) {
  return { count: props.initialValue }
}

const Counter: Component<CounterProps> = component({
  displayName: 'Counter',
  memoize: true,

  validate: Spec.checkProps({
    optional: {
      initialValue: Spec.integer,
      label: Spec.string
    }
  }),

  defaultProps: {
    initialValue: 0,
    label: 'Counter'
  },

  initState: initCounterState,

  main({ c, props, state, update }) {
    const
      onIncrement = () => update({ count: state.count + 1 })

    useOnMount(c, () => {
      console.log('Component has been mounted')

      return () => console.log('Component will be unmounted')
    })

    useOnUpdate(c, ()=> {
      console.log(`Component has been rendered - ${props.label}: ${state.count}`)
    })

    return () => {
      return (
        <div>
          <label>{props.label}: </label> 
          <button onClick={onIncrement}>
            {state.count}
          </button>
        </div>
      )
    }
  }
})

export default <Counter/> 
