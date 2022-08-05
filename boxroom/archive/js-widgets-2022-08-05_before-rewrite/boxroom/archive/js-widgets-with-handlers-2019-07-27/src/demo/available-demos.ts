import { VirtualElement } from '../modules/core/main/index'

// hooks
import helloWorld from './demos/hooks/hello-world'
import simpleCounter from './demos/hooks/simple-counter'
import simpleCounterAlt from './demos/hooks/simple-counter-alt'
import complexCounter from './demos/hooks/complex-counter'
import stopWatch from './demos/hooks/stop-watch'
import stopWatchAlt from './demos/hooks/stop-watch-alt'
import stopWatchAlt2 from './demos/hooks/stop-watch-alt2'
import i18n from './demos/hooks/i18n'
import friendList from './demos/hooks/friend-list'


// handlers
import simpleCounter2 from './demos/handlers/simple-counter'
import stopWatch2 from './demos/handlers/stop-watch'
import stopWatch2Alt from './demos/handlers/stop-watch-alt'

const demos: [string, VirtualElement][] = [
  ['Hello world (hooks)', helloWorld],
  ['Simple counter (hooks)', simpleCounter],
  ['Simple counter - alternative (hooks)', simpleCounterAlt],
  ['Complex counter (hooks)', complexCounter],
  ['Stop watch (hooks)', stopWatch],
  ['Stop watch - using store (hooks)', stopWatchAlt],
  ['Stop watch - using withData (hooks)', stopWatchAlt2],
  ['Internationalization (hooks)', i18n],
  ['Friend list (hooks)', friendList],

  ['Simple counter (handlers)', simpleCounter2],
  ['Stop watch (handlers)', stopWatch2],
  ['Stop watch - using store (handlers)', stopWatch2Alt],
]

export default demos
