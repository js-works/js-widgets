import { createElement, defineComponent } from '../../../modules/core/main/index'
import { withState, withOnUnmount } from '../../../modules/handlers/main/index' 
import { memoize } from '../../../modules/util/main/index'

const StopWatch = defineComponent({
  displayName: 'StopWatch',

  init(c) {
    let
      interval = 0,
      running = false,
      time = 0

    const
      [getTime, setTime] = withState(c, (time: number) => time),
      [getRunning, setRunning] = withState(c, (running: boolean) => running),
      stopTimerOnUnmount = withOnUnmount(c, () => stopTimer()),

      onStartStop = () => {
        if (running) {
          stopTimer()
        } else {
          startTimer(running, time)
        }
      },

      onReset = () => resetTimer()

    function startTimer(running: boolean, time: number) {
      if (!running) {
        const startTime = Date.now() - time

        interval = window.setInterval(() => {
          setTime(Date.now() - startTime)
        }, 10)

        setRunning(true)
      }
    }

    function stopTimer() {
      if (running) {
        clearInterval(interval)
        interval = 0 
        setRunning(false)
      }
    }

    function resetTimer() {
      stopTimer()
      setTime(0)
    }

    return () => {
      time = getTime(0),
      running = getRunning(false)

      stopTimerOnUnmount()

      return (
        <div>
            <div>Time: {time}</div>
            <button onClick={onStartStop}>
              { running ? 'Stop' : 'Start'}
            </button>
            <button onClick={onReset}>
              Reset
            </button>
        </div>
      )
    }
  }
})

export default StopWatch()
