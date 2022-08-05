import { createElement, defineComponent } from '../../../modules/core/main/index'
import { useOnMount, useOnUpdate, useProps, useState } from '../../../modules/hooks/main/index'

type CounterProps = {
  label?: string,
  initialValue?: number
}

const Counter = defineComponent<CounterProps>({
  displayName: 'Counter',
  memoize: true,

  defaults: {
    initialValue: 0,
    label: 'Counter'
  },

  init(c) {
    const
      getProps = useProps(c),
      [getCount, setCount] = useState(c, getProps().initialValue),
      onIncrement = () => setCount(count => count! + 1)

    useOnMount(c, () => {
      console.log('Component has been mounted.')
    })

    useOnUpdate(c, () => {
      console.log('Component has been rendered.')
    })

    return props => {
      return (
        <div>
          <label>{props.label + ': '}</label> 
          <button onClick={onIncrement}>
            {getCount()}
          </button>
        </div>
      )
    }
  }
})

export default <Counter/> 
