import { h, component, context, useEffect, Component }
  from '../../modules/root/main/index'

const LocaleCtx = context({
  displayName: 'LocaleCtx',
  defaultValue: 'en'
})

type CounterProps = {
  initialValue?: number,
  label?: string
}

function initCounterState(props: CounterProps) {
  return { count: props.initialValue! }
}

const Counter: Component<CounterProps> = component({
  displayName: 'Counter',

  defaultProps: {
    initialValue: 0,
    label: 'Counter'
  },

  ctx: {
    locale: LocaleCtx
  },

  initState: initCounterState,

  main({ c, props, state, ctx, update }) {
    const
      onIncrement = () => update({ count: state.count + 1 }),
      onDecrement = () => update({ count: state.count - 1 })

    useEffect(c, () => {
      console.log('Updated - count:', state.count)
    })

    return () => (
      <div>
        <div>Locale: {ctx.locale}</div>
        <br/>
        <label>{props.label}: </label>
        <button onClick={onDecrement}>-</button>
        <span> {state.count} </span>
        <button onClick={onIncrement}>+</button>
      </div>
    )
  }
})

export default <Counter/>
