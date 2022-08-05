import { h, component } from '../../modules/core/main/index'
import { useOnUnmount, useState } from '../../modules/hooks/main/index'

const StopWatch = component({
  displayName: 'StopWatch',

  init(c) {
    let interval = 0

    const
      [getTime, setTime] = useState(c, 0),
      [isRunning, setRunning] = useState(c, false),

      onStartStop = () => {
        if (isRunning()) {
          stopTimer()
        } else {
          startTimer()
        }
      },

      onReset = () => resetTimer()

    useOnUnmount(c, () => stopTimer())
    
    function startTimer() {
      if (!isRunning()) {
        const startTime = Date.now() - getTime() 

        interval = window.setInterval(() => {
          setTime(Date.now() - startTime)
        }, 10)

        setRunning(true)
      }
    }

    function stopTimer() {
      if (isRunning()) {
        clearInterval(interval)
        interval = 0
        setRunning(false)
      }
    }

    function resetTimer() {
      stopTimer()
      setTime(0)
    }

    return () =>
      <div>
        <div>Time: {getTime()}</div>
        <button onClick={onStartStop}>
          { isRunning() ? 'Stop' : 'Start'}
        </button>
        <button onClick={onReset}>
          Reset
        </button>
      </div>
  }
})

export default <StopWatch/>
