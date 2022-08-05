import { h, component, useImperativeHandle, useState, Component, Ref }
  from '../../modules/root/main/index'

type CounterProps = {
  label?: string,
  initialValue?: number,
  ref?: Ref<{ reset(n: number): void }>
}

const Counter: Component<CounterProps> = component({
  displayName: 'Counter',
  memoize: true,

  defaultProps: {
    initialValue: 0,
    label: 'Counter'
  },

  main(c, props) {
    const
      [state, setState] = useState(c, { count: props.initialValue }),
      onIncrement = () => setState({ count: state.count + 1 }),
      onDecrement = () => setState({ count: state.count - 1})

    useImperativeHandle(c, props.ref, {
      reset(n: number = 0) {
        setState({ count: n })
      }
    })

    return () => (
      <div>
        <label>{props.label}: </label>
        <button onClick={onDecrement}>-</button>
        {` ${state.count} `}
        <button onClick={onIncrement}>+</button>
      </div>
    )
  }
})

const Demo = component({
  displayName: 'Demo',

  main() {
    const
      counterRef = { current: null } as any, // TODO
      onResetTo0 = () => counterRef.current.reset(0),
      onResetTo100 = () => counterRef.current.reset(100)

    return () => (
      <div>
        <Counter ref={counterRef}/>
        <br/>
        <div>
          <button onClick={onResetTo0}>Set to 0</button>
          {' '}
          <button onClick={onResetTo100}>Set to 100</button>
        </div>
      </div>
    )
  }
})

export default <Demo/>
