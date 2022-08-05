import { h, component, useProps, useState, useOnMount, useOnUpdate, Component }
  from '../../modules/root/main/index'

import { Spec } from 'js-spec'

type CounterProps = {
  initialValue?: number,
  label?: string
}

const Counter: Component<CounterProps> = component({
  displayName: 'Counter',
  memoize: true,

  init(c) {
    const
      [$props] = useProps(c, { initialValue: 0, label: 'Counter' }),
      [$count, setCount] = useState(c, 0),
      onIncrement = () => setCount(it => it + 1)
    
    useOnMount(c, () => {
      console.log('Component has been mounted')

      return () => console.log('Component will be unmounted')
    })

    useOnUpdate(c, ()=> {
      console.log(`Component has been rendered - ${$props.label}: ${$count.value}`)
    })

    return () => {
      return (
        <div>
          <label>{$props.label}: </label> 
          <button onClick={onIncrement}>
            {$count.value}
          </button>
        </div>
      )
    }
  }
})

export default <Counter/> 
