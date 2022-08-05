import { createElement, defineComponent } from '../../../modules/core/main/index'
import { useOnUnmount, useState } from '../../../modules/hooks/main/index'
import { initStore } from 'js-stores'
import { useStore } from 'js-stores/with-js-widgets'

function createStopWatchStore() {
  let interval = 0
  
  const [self, update] = initStore({
    time: 0,
    running: false,
    
    startTimer() {
      if (!self.running) {
        const startTime = Date.now() - self.time 

        interval = window.setInterval(() => {
          update({ time: Date.now() - startTime })
        }, 10)

        update({ running: true })
      }
    },

    stopTimer() {
      if (self.running) {
        clearInterval(interval)
        interval = 0
        update({ running: false })
      }
    },
    
    resetTimer() {
      self.stopTimer()
      update({ time: 0 })
    }
  })
  
  return self
}

const StopWatch = defineComponent({
  displayName: 'StopWatch',

  init(c) {
    const
      store = useStore(c, createStopWatchStore),
      onStartStop = () => store.running ? store.stopTimer() : store.startTimer(),
      onReset = () => store.resetTimer()

    useOnUnmount(c, () => store.resetTimer())
    
    return () =>
      <div>
        <div>Time: {store.time}</div>
        <button onClick={onStartStop}>
          { store.running ? 'Stop' : 'Start'}
        </button>
        <button onClick={onReset}>
          Reset
        </button>
      </div>
  }
})

export default <StopWatch/>
