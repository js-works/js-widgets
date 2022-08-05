import { h, component, useOnUpdate, useState, Component } from '../../modules/root/main/index'
import * as Spec from 'js-spec/validators'

type CounterProps = {
  initialValue?: number,
  label?: string
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

  main(c, props) {
    const
      [state, update] = useState(c, { count: props.initialValue }),
      onIncrement = () => update({ count: state.count + 1 }),
      onDecrement = () => update({ count: state.count - 1 })

    useOnUpdate(c, () => {
      console.log(`Component has been rendered - ${props.label}: ${state.count}`)
    })

    return () => {
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
    }
  }
})

export default <Counter/> 
