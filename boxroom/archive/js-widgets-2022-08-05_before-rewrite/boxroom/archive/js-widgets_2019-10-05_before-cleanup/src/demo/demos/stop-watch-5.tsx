import { h, component } from '../../modules/core/main/index'
import { handleEffect, handleState } from '../../modules/handlers/main/index'

type StopWatchProps = {
  name?: string
}

const StopWatch = component<StopWatchProps>({
  displayName: 'StopWatch',

  init(c) {
    const
      [useState, setState] = handleState(c, () => ({
        startTime: 0,
        duration: 0,
        running: false
      })),

      onStartStop = () => {
        setState(state =>
          !state.running
            ? { running: true, startTime: Date.now() - state.duration }
            : { running: !state.running })
      },

      onReset = () => setState({ running: false, duration: 0, startTime: 0 }),

      useTimer = handleEffect(c, (running: boolean, name: string) => {
        if (running) {
          console.log(`Starting "${name}"`)

          const interval = setInterval(() => {
            if (running) {
              setState(state => ({ duration: Date.now() - state.startTime }))
            }
          }, 10)

          return () => {
            console.log(`Stopping "${name}"`)
            clearInterval(interval)
          }
        }
      })

    return ({ name = 'Stop Watch' }) => {
      const { duration, running } = useState()

      useTimer(running, name)

      return (
        <div>
          <h4>{name}</h4>
          <div>Duration: {duration}</div>
          <button onClick={onStartStop}>
            { running ? 'Stop' : 'Start' }
          </button>
          <button onClick={onReset}>
            Reset
          </button>
        </div>
      )
    }
  }
})

export default (
  <div>
    <StopWatch name="Stop watch 1"/>
    <StopWatch name="Stop watch 2"/>
  </div>
)
