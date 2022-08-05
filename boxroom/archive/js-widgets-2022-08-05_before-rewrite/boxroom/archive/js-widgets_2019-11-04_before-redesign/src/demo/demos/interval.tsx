import { h, component, useInterval, useState } from '../../modules/root/main/index'

const Demo = component('Demo', {
  init(c) {
    const
      [$count, setCount] = useState(c, 0),
      [$delay, setDelay] = useState(c, 1000),
      onReset = () => setDelay(1000)

    useInterval(c, () => {
      setCount(it => it + 1)
    }, $delay)

    useInterval(c, () => {
      if ($delay.value > 10) {
        setDelay(i => i / 2)
      }
    }, 1000)

    return () => 
      <div>
        <h1>Counter: {$count}</h1>
        <h4>Delay: {$delay}</h4>
        <button onClick={onReset}>
          Reset delay
        </button>
      </div>
  }
})

export default <Demo/>
