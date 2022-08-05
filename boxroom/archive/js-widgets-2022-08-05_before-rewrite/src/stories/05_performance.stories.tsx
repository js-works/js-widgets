import { demo } from './utils'
import { createElement } from 'dyo'
import { h, component, Component, VNode } from '../modules/core/main/index'
import { useEffect, useProps, useState } from '../modules/hooks/main/index'
import { forceUpdate } from '../modules/util/main/index'
import { div } from '../modules/html/main/index'

export default {
  title: 'Performance'
}

// === Performance test 1 ============================================

const d = createElement

function runTests() {
  const
    iterationCount = 1000000,
    tests = []

  let result = ''

  tests.push({
    name: 'use function "createElement" from Dyo',

    run() {
      for (let i = 0; i < iterationCount; ++i) {
        d('div',
          { className: 'my-class', id: 'my-id', key: 1 },
          d('div',
            { className: 'my-class2', id: 'my-id2', key: 2},
            d('div', null, d('div', null, d('div', null, d('div')))),
            'some text', [1, 2, 3, 4, 5]))  
      }
    }
  }),

  tests.push({
    name: 'use function "h" from js-widgets',

    run() {
      for (let i = 0; i < iterationCount; ++i) {
        h('div',
          { className: 'my-class', id: 'my-id', key: 1 },
          h('div',
            { className: 'my-class2', id: 'my-id2', key: 2},
            h('div', null, h('div', null, h('div', null, h('div')))),
            'some text', [1, 2, 3, 4, 5]))  
      }
    }
  }),
  
  
  tests.push({
    name: 'use HTML factories from "js-widgets/html"',

    run() {
      for (let i = 0; i < iterationCount; ++i) {
        div(
          { className: 'my-class', id: 'my-id', key: 1 },
          div({ className: 'my-class2', id: 'my-id2', key: 2},
            div(null, div(null, div(null, div()))),
            'some text', [1, 2, 3, 4, 5]))  
      }
    }
  })

  for (let i = 0; i < tests.length; ++i) {
    const
      test = tests[i],
      startTime = Date.now()
    
    test.run()

    const
      stopTime = Date.now(),
      duration = (stopTime - startTime) + ' ms'

    const message = `Run time for test '${test.name}': ${duration}`

    if (i == 0) {
      result = message
    } else {
      result += '\n' + message
    }
  }

  result += '\nAll tests finished.'

  return result
}

const PerformanceTest = component({
  name: 'PerformanceTest',

  init(c) {
    const
      [state, setState] = useState(c, {
        running: false,
        result: ''
      }),

      onStart = () => startTest()

    function startTest() {
      setState({ running: true })
    }

    useEffect(c, () => {
      if (state.running) {
        const result = runTests()
       
        setState({
          running: false,
          result
        })
      }
    })

    return () =>
      <div> 
        <h4>Measuring time to build virtual dom trees</h4>
        { 
          !state.running
            ? <div>
                <Report result={state.result}/> 
                <button onClick={onStart}>
                  { state.result === '' ? 'Start tests' : 'Restart tests' }
                </button>
              </div>
            : <div>Running performance test - please wait...</div>
        }
      </div>
  }
})

type ReportProps = {
  result: string
}

const Report = component<ReportProps>({
  name: 'Report',

  render({ result }) {
    let ret = null
    
    if (result && result.trim().length > 0) {
      ret = <pre>{result}</pre>
    }

    return ret
  }
})

export const performanceTest1 = demo(<PerformanceTest/>)

// === Performance test 2 ============================================


const prefs = {
  framesPerSecond: 240,
  colors: ['red', 'yellow', 'orange'],
  tileWidth: 5,
  columnCount: 20,
  rowCount: 20
}

type TileProps = {
  color?: string,
  width?: number
}

const Tile = component<TileProps>({
  name: 'Tile',

  render({
    color = 'white',
    width = 3
  }) {
    const
      style = {
        float: 'left',
        width: width + 'px',
        height: width + 'px',
        backgroundColor: color,
        padding: 0,
        margin: 0
      }
        
    return <div style={style as any}/> // TODO
  }
})

type TypeRowProps = {
  tileWidth?: number,
  columnCount?: number,
  colors?: string[],
}

const TileRow: Component<TypeRowProps> = component({
  name: 'TileRow',

  render({
    tileWidth = 3,
    columnCount = prefs.columnCount,
    colors = prefs.colors
  }) {
    const tiles = []

    for (let x = 0; x < columnCount; ++x) {
      const
        colorIdx = Math.floor(  Math.random() * colors.length),
        color = colors[colorIdx]

        tiles.push(<Tile width={tileWidth} color={color} key={x}/>)
    }

    return <div style={{ clear: 'both' }}>{tiles}</div>
  }
})

type SpeedTestProps = {
  columnCount?: number,
  rowCount?: number,
  tileWidth?: number,
  framesPerSecond?: number
}

const SpeedTest: Component<SpeedTestProps> = component({
  name: 'SpeedTest',
  
  init(c) {
    let 
      props = useProps(c, {
        tileWidth: 3,
        rowCount: prefs.rowCount,
        columnCount: prefs.columnCount,
        framesPerSecond: prefs.framesPerSecond
      }),

      intervalId = null as any,
      startTime = Date.now(),
      frameCount = 0,
      actualFramesPerSecond = '0'

    const
      style = {
        marginTop: 40,
        marginLeft: 40
      }

    useEffect(c, () => {
      intervalId = setInterval(() => {
        ++frameCount

        if (frameCount % 10 === 0) {
          actualFramesPerSecond =
            (frameCount * 1000.0 /
              (Date.now() - startTime)).toFixed(2)
        }

        forceUpdate(c)
      }, 1000 / props.framesPerSecond)

      return () => clearInterval(intervalId)
    }, null)

  
    return () => {
      const
        rows: VNode[] = []
      
      for (let y = 0; y < props.rowCount; ++y) {
        rows.push(
          <TileRow
            tileWidth={props.tileWidth}
            columnCount={props.columnCount}
            key={y}
          />)
      }

      return (
        <div>
        <div> 
            Rows: {props.rowCount}, columns: {props.columnCount}
            <div style={style}>{rows}</div>
          </div>
          <br/>
          <div style={{ clear: 'both' }}>
            (actual frames per second: {actualFramesPerSecond})
          </div>
        </div>
      )
    }
  }
})

export const performanceTest2 = demo(
  <SpeedTest
    tileWidth={prefs.tileWidth}
    columnCount={prefs.columnCount}
    rowCount={prefs.rowCount}
  />
)
