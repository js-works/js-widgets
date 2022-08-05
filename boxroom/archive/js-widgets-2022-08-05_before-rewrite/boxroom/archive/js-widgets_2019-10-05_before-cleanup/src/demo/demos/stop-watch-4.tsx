import { h,  component } from '../../modules/core/main/index'
import { useEffect, useProps, useOnMount, useStateObject } from '../../modules/hooks/main/index'
import { componentActions, wrap } from '../../modules/tools/main/index'

type StopWatchProps = {
  name?: string
}

type StopWatchState = {
  time: number,
  running: boolean,
}

function initStopWatchState(): StopWatchState {
  return { time: 0, running: false }
}

const useStopWatchActions = componentActions((state, setState) => {
  let
    startTime = 0,
    intervalId = null as any

  return {
    startStop() {
      if (state.running) {
        stopTicker()
      } else {
        startTime = Date.now() - state.time

        intervalId = setInterval(() => {
          setState({ time: Date.now() - startTime })
        })
      }

      setState({ running: !state.running })
    },
    
    reset() {
      stopTicker()
      startTime = 0
      setState({ running: false, time: 0 })
    }
  }

  function stopTicker() {
    if (intervalId) {
      clearTimeout(intervalId)
      intervalId = null
    }
  }
}, initStopWatchState)

const StopWatch = component<StopWatchProps>({
  displayName: 'StopWatch',

  init(c) {
    const
      getProps = useProps(c, { name: 'StopWatch' }),
      [actions, getState] = useStopWatchActions(c),

      [, use] = wrap({
        props: getProps,
        state: getState
      }),

      onStartStop = () => actions.startStop(),
      onReset = () => actions.reset()

    return use(({ props, state }) =>
      <div>
        <h4>{props.name}</h4>
        <div>Time: {state.time}</div>
        <button onClick={onStartStop}>
          { state.running ? 'Stop' : 'Start' }
        </button>
        <button onClick={onReset}>
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
