import { h, component }
  from '../../modules/core/main/index'

import { useProps, useState }
  from '../../modules/hooks/main/index'

type CounterProps = {
  label?: string,
  initialValue?: number
}

const defaultCounterProps = {
  label: 'Counter',
  initialValue: 0
}

const Counter: any = component<CounterProps>({ // TODO
  displayName: 'Counter',

  *init() {
    const
      getProps = yield useProps(defaultProps),
      [getCount, setCount] = yuield useState(getProps().initialValue)
  }

  render({ initialValue = 0, label = 'Counter' }) {
    const
      [count, setCount] = useState(() => initialValue),
      onIncrement = useCallback(() => setCount(count + 1))

    useEffect(() => {
      console.log('Component has been mounted')
    }, [])

    useEffect(() => {
      console.log('Component has been rendered')
    })
    

    return (
      <div>
        <label>{label} </label>
        <button onClick={onIncrement}>{count}</button>
      </div>
    )
  }
})

export default <Counter/>
