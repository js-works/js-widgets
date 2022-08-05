import { createElement } from 'dyo'

import { h, component, useEffect, useState }
  from '../../modules/root/main/index'

const
  d = createElement,
  div = h.bind(null, 'div')

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
  displayName: 'PerformanceTest',

  initState: {
    running: false,
    result: ''
  },

  main({ c, state, update }) {
    const
      onStart = () => startTest()

    function startTest() {
      update({ running: true })
    }

    useEffect(c, () => {
      if (state.running) {
        const result = runTests()
       
        update({
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
  displayName: 'Report',

  render({ result }) {
    let ret = null
    
    if (result && result.trim().length > 0) {
      ret = <pre>{result}</pre>
    }

    return ret
  }
})

export default <PerformanceTest/>
