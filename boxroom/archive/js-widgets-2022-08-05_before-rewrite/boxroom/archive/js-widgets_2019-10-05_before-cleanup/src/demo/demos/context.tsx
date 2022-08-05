import { h, context, component } from '../../modules/core/main/index'
import { useState, useOnMount } from '../../modules/hooks/main/index'

const CounterCtx = context({
  displayName: 'CounterCtx',
  defaultValue: 0
})

const ContextDemo = component({
  displayName: 'ContextDemo',

  init(c) {
    const [getCount, setCount] = useState(c, 0)

    useOnMount(c, () => {
      const interval = setInterval(() => {
        setCount(count => count + 1)
      }, 1000)

      return () => clearInterval(interval)
    })

    return () => (
      <CounterCtx.Provider value={getCount()}>
        <Output/>
      </CounterCtx.Provider>
    )
  }
})

const Output = component({
  displayName: 'Output',
  memoize: true,

  render() {
    return (
      <div>
        <div>
          Last update: {new Date().toLocaleTimeString()}
        </div>
        <CounterCtx.Consumer>
          {count => `Current counter value: ${count}`}
        </CounterCtx.Consumer>
      </div>
    )
  }
})

export default <ContextDemo/>
