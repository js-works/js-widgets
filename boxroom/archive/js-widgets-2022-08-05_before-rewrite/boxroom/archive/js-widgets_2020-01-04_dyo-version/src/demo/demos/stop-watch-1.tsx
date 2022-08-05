import { h, component, useOnUnmount, useState } from '../../modules/root/main/index'

const StopWatch = component('Stop watch', {
  main(c) {
    let interval = 0

    const
      [state, setState] = useState(c, {
        time: 0,
        running: false
      }),

      onStartStop = () => {
        if (state.running) {
          stopTimer()
        } else {
          startTimer()
        }
      },

      onReset = () => resetTimer()

    useOnUnmount(c, () => stopTimer())
    
    function startTimer() {
      if (!state.running) {
        const startTime = Date.now() - state.time

        interval = window.setInterval(() => {
          setState({ time: Date.now() - startTime })
        }, 10)

        setState({ running: true })
      }
    }

    function stopTimer() {
      if (state.running) {
        clearInterval(interval)
        interval = 0
        setState({ running: false })
      }
    }

    function resetTimer() {
      stopTimer()
      setState({ time: 0 })
    }

    return () =>
      <div>
        <div>Time: {state.time}</div>
        <button onClick={onStartStop}>
          { state.running ? 'Stop' : 'Start'}
        </button>
        <button onClick={onReset}>
          Reset
        </button>
      </div>
  }
})

export default <StopWatch/>
