import { createElement, defineComponent } from '../../../modules/core/main/index'
import { withState } from '../../../modules/handlers/main/index'

type CounterProps = {
  label?: string,
  initialValue?: number
}

const Counter = defineComponent<CounterProps>({
  displayName: 'Counter',

  init(c) {
    const
      [getCount, setCount] = withState(c, (n: number) => n),
      onIncrement = () => setCount(count => count + 1)

    return ({ label = 'Counter', initialValue = 0 }) => {
      const count = getCount(initialValue)

      return (
        <div>
          <label>{label + ': '}</label> 
          <button onClick={onIncrement}>
            {count}
          </button>
        </div>
      )
    }
  }
})

export default Counter()
