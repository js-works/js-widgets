import { h, component } from '../../modules/core/main/index'
import { useOnMount, useOnUpdate, useProps, useState } from '../../modules/hooks/main/index'
import { wrap } from '../../modules/tools/main/index'
import { Spec } from 'js-spec'

type CounterProps = {
  initialValue?: number,
  label?: string
}

const Counter = component('Counter', {
  memoize: true,

  validate: Spec.checkProps({
    optional: {
      initialValue: Spec.integer,
      label: Spec.string
    }
  }),

  init(c) {
    const
      getProps = useProps(c, {
        initialValue: 0,
        label: 'Counter'
      }),

      [getCount, setCount] = useState(c, getProps().initialValue),

      [v, use] = wrap({
        props: getProps,
        count: getCount
      }),

      onIncrement = () => setCount(v.count + 1)

    useOnMount(c, () => {
      console.log('Component has been mounted')

      return () => console.log('Component will be unmounted')
    })

    useOnUpdate(c, ()=> {
      console.log(`Component has been rendered - ${v.props.label}: ${v.count}`)
    })

    return use(({ props, count }) => {
      return (
        <div>
          <label>{props.label}: </label> 
          <button onClick={onIncrement}>
            {count}
          </button>
        </div>
      )
    })
  }
})

export default <Counter/> 
