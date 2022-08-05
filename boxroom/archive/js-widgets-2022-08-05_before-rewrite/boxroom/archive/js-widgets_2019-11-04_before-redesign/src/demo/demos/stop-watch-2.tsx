import { h, component, useEffect, Component } from '../../modules/root/main/index'

type StopWatchProps = {
  name?: string
}

const StopWatch: Component<StopWatchProps> = component({
  displayName: 'StopWatch',

  defaultProps: {
    name: 'Stop Watch'
  },

  initState: {
    startTime: 0,
    duration: 0,
    running: false
  },

  main({ c, props, state, update }) {
    const
      onStartStop = () => {
        if (!state.running) {
          update({ running: true, startTime: Date.now() - state.duration })
        } else {
          update({ running: false })
        }
      },

      onReset = () => update({ running: false, duration: 0, startTime: 0 })

    useEffect(c, () => {
      if (state.running) {
        console.log(`Starting "${props.name}"`)

        const interval = setInterval(() => {
          if (state.running) {
            update({ duration: Date.now() - state.startTime })
          }
        }, 10)

        return () => {
          console.log(`Stopping "${props.name}"`)
          clearInterval(interval)
        }
      }
    }, () => [state.running])

    return () =>
      <div>
        <h4>{props.name}</h4>
        <div>Duration: {state.duration}</div>
        <button onClick={onStartStop}>
          { state.running ? 'Stop' : 'Start' }
        </button>
        <button onClick={onReset}>
          Reset
        </button>
      </div>
  }
})

export default (
  <div>
    <StopWatch name="Stop watch 1"/>
    <StopWatch name="Stop watch 2"/>
  </div>
)
