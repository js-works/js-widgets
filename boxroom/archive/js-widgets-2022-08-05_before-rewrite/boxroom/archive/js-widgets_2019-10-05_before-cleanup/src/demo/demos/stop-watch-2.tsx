import { h,  component } from '../../modules/core/main/index'
import { useEffect, useProps, useOnMount, useStateObject } from '../../modules/hooks/main/index'
import { wrap } from '../../modules/tools/main/index'

type StopWatchProps = {
  name?: string
}

const StopWatch = component<StopWatchProps>({
  displayName: 'StopWatch',
  
  init(c) {
    let startTime = 0

    const
      [getState, setState] = useStateObject(c, {
        time: 0,
        running: false
      }),

      [v, use] = wrap({
        props: useProps(c, { name: 'StopWatch' }),
        state: getState
      })

    useOnMount(c, () => {
      console.log(`${v.props.name} has been mounted`)

      return () => {
        reset()
        console.log(`${v.props.name} will be unmounted`)
      }
    })

    function startStop() {
      setState({ running: !v.state.running })
    }

    function reset() {
      startTime = 0
      setState({ running: false, time: 0 })
    }

    useEffect(c, () => {
      if (v.state.running) {
        startTime = Date.now() - v.state.time

        console.log(`Starting "${v.props.name}"`)

        const interval = setInterval(() => {
          if (v.state.running) {
            setState({ time: Date.now() - startTime })
          }
        }, 10)

        return () => {
          console.log(`Stopping "${v.props.name}"`)
          clearInterval(interval)
        }
      }
    }, () => [v.state.running])

    return use(({ props, state }) =>
      <div>
        <h4>{props.name}</h4>
        <div>Time: {state.time}</div>
        <button onClick={startStop}>
          { state.running ? 'Stop' : 'Start' }
        </button>
        <button onClick={reset}>
          Reset
        </button>
      </div>
    )
  }
})

export default (
  <div>
    <StopWatch name="Stop watch 1"/>
    <StopWatch name="Stop watch 2"/>
  </div>
)
