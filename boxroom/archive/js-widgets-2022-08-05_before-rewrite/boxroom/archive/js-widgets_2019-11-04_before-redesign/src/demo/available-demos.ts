import { VirtualElement } from '../modules/core/main/index'

import helloWorld from './demos/hello-world'
import simpleCounter1 from './demos/simple-counter-1'
import simpleCounter2 from './demos/simple-counter-2'
import simpleCounter3 from './demos/simple-counter-3'
import simpleCounter4 from './demos/simple-counter-4'
import complexCounter from './demos/complex-counter'
import clock from './demos/clock'
import iterators from './demos/iterators'
import fragments from './demos/fragments'
import boundary from './demos/boundary'
import stopWatch1 from './demos/stop-watch-1'
import stopWatch2 from './demos/stop-watch-2'
import mousePosition from './demos/mouse-position'
import context from './demos/context'
import i18n from './demos/i18n'
import interval from './demos/interval'
import performanceTest1 from './demos/performance-test-1'
import performanceTest2 from './demos/performance-test-2'

const demos: [string, VirtualElement][] = [
  ['Hello world', helloWorld],
  ['Simple counter 1', simpleCounter1],
  ['Simple counter 2', simpleCounter2],
  ['Simple counter 3', simpleCounter3],
  ['Simple counter 4', simpleCounter4],
  ['Complex counter', complexCounter],
  ['Clock', clock],
  ['Iterators', iterators],
  ['Fragments', fragments],
  ['Boundary', boundary],
  ['Stop watch 1', stopWatch1],
  ['Stop watch 2', stopWatch2],
  ['Mouse position', mousePosition],
  ['Context', context],
  ['Internationalization', i18n],
  ['Interval', interval],
  ['Performance test 1', performanceTest1],
  ['Performance test 2', performanceTest2],
]

export default demos
