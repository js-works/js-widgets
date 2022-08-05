import { h, component, useOnUnmount } from '../../modules/root/main/index'

const StopWatch = component('Stop watch', {
  initState: {
    time: 0,
    running: false
  },

  main({ c, state, update }) {
    let interval = 0

    const
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
          update({ time: Date.now() - startTime })
        }, 10)

        update({ running: true })
      }
    }

    function stopTimer() {
      if (state.running) {
        clearInterval(interval)
        interval = 0
        update({ running: false })
      }
    }

    function resetTimer() {
      stopTimer()
      update({ time: 0 })
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
