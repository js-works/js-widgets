import { createElement, defineComponent } from '../../../modules/core/main/index'
import { useOnMount, useOnUpdate, useState } from '../../../modules/hooks/main/index'
import { withData } from '../../../modules/util/main/index'

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

  init(c, getProps) {
    const
      [getCount, setCount] = useState(c, getProps().initialValue),

      [data, view] = withData({
        props: getProps,
        count: getCount
      }),

      onIncrement = () => setCount(count => count! + 1)

    useOnMount(c, () => {
      console.log('Component has been mounted - props:', data.props)
    })

    useOnUpdate(c, () => {
      console.log('Component has been rendered - props:', data.props, ' - count value:', data.count)
    })
    
    return view(({ props, count }) => {
      return (
        <div>
          <label>{props.label + ': '}</label> 
          <button onClick={onIncrement}>
            {count}
          </button>
        </div>
      )
    })
  }
})

export default <Counter/>
