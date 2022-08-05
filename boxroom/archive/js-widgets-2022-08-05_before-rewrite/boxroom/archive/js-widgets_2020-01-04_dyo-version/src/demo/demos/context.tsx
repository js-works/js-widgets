import { h, context, component, useState, useOnMount } from '../../modules/root/main/index'

const CounterCtx = context({
  displayName: 'CounterCtx',
  defaultValue: 0
})

const ContextDemo = component({
  displayName: 'ContextDemo',

  main(c)  {
    const [state, setState] = useState(c, { count: 0 })

    useOnMount(c, () => {
      const interval = setInterval(() => {
        setState({ count: state.count + 1 })
      }, 1000)

      return () => clearInterval(interval)
    })

    return () => (
      <CounterCtx.Provider value={state.count}>
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
