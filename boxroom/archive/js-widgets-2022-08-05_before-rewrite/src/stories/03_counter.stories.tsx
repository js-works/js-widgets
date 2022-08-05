import { demo } from './utils'
import { component, h, Component, Ref } from '../modules/core/main/index'
import { useMethods, useProps, useState, useValue } from '../modules/hooks/main/index'

export default { title: 'Counters' }

// === SimpleCounter =================================================

type SimpleCounterProps = {
  label?: string,
  initialCount?: number
}

const SimpleCounter: Component<SimpleCounterProps> = component({
  name: 'Counter',

  init(c) {
    const
      props = useProps(c, {
        initialCount: 0,
        label: 'Counter'
      }),

      [count, setCount] = useValue(c, props.initialCount),
      onIncrement = () => setCount(it => it + 1)

    return () => 
      <div>
        <label>{props.label}: </label>
        <button onClick={onIncrement}>
          {count.value}
        </button>
      </div>
  }
})

// === ComplexCounter ================================================

type ComplexCounterProps = {
  label?: string,
  initialValue?: number,
  ref?: Ref<{ reset(n: number): void }>
}

const ComplexCounter: Component<ComplexCounterProps> = component({
  name: 'ComplexCounter',
  memoize: true,

  init(c) {
    const
      props = useProps(c, {
        initialValue: 0,
        label: 'Counter'
      }),

      [state, setState] = useState(c, { count: props.initialValue }),
      onIncrement = () => setState({ count: state.count + 1 }),
      onDecrement = () => setState({ count: state.count - 1})

    useMethods(c, {
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

const ComplexCounterDemo = component({
  name: 'ComplexCounterDemo',

  init() {
    const
      counterRef = { current: null } as any, // TODO
      onResetTo0 = () => counterRef.current.reset(0),
      onResetTo100 = () => counterRef.current.reset(100)

    return () => (
      <div>
        <ComplexCounter ref={counterRef}/>
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

// --- exports -------------------------------------------------------

export const simpleCounter1 = demo(<SimpleCounter/>)
export const simpleCounter2 = demo(<SimpleCounter label="Custom counter" initialCount={100}/>)
export const complexCounter = demo(<ComplexCounterDemo/>)