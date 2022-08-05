import { createElement, defineComponent } from '../../../modules/core/main/index'
import { useOnUnmount, useStateObject } from '../../../modules/hooks/main/index'
import { withData } from '../../../modules/util/main/index'

const StopWatch = defineComponent({
  displayName: 'StopWatch',

  init(c) {
    const
      [getState, setState] = useStateObject(c, { time: 0, running: false}),

      [data, view] = withData({
        state: getState
      }),

      vars = {
        interval: 0
      },

      onStartStop = () => {
        if (data.state.running) {
          stopTimer()
        } else {
          startTimer()
        }
      },

      onReset = () => resetTimer()

    useOnUnmount(c, () => stopTimer())
    
    function startTimer() {
      if (!data.state.running) {
        const startTime = Date.now() - data.state.time

        vars.interval = window.setInterval(() => {
          setState({ time: Date.now() - startTime })
        }, 10)

        setState({ running: true })
      }
    }

    function stopTimer() {
      if (data.state.running) {
        clearInterval(vars.interval)
        vars.interval = 0
        setState({ running: false })
      }
    }

    function resetTimer() {
      stopTimer()
      setState({ time: 0 })
    }

    return view(({ state }) =>
      <div>
        <div>Time: {state.time}</div>
        <button onClick={onStartStop}>
          { state.running ? 'Stop' : 'Start'}
        </button>
        <button onClick={onReset}>
          Reset
        </button>
      </div>
    )
  }
})

export default <StopWatch/>
