import { h, component, mount, VirtualNode }
  from '../modules/core/main/index'

import { useForceUpdate, useProps }
  from '../modules/hooks/main/index'

import '../modules/adapt-react/main/index'
import availableDemos from './available-demos'

// --- Component DemoSelector ---------------------------------------

type DemoSelectorProps = {
  demos: [string, VirtualNode][]
}

const DemoSelector: any = component<DemoSelectorProps>({
  displayName: 'DemoSelector',

  *init() {
    let demoIdx: number

    const
      getProps = yield useProps(),
      forceUpdate = yield useForceUpdate()

    function startDemo(idx: number) {
      demoIdx = idx
      document.location.href = document.location.href.replace(/#.*$/, '') + '#idx=' + idx
      console.clear()
      
      console.log('start demo', idx)
      forceUpdate()
    }

    return () => {
      const options = []

      for (let i = 0; i < getProps().demos.length; ++i) {
        const demo = getProps().demos[i]
            
        options.push(<option key={i} value={i}>{demo[0]}</option>)
      }

      return (
        <div>
          <div>
            <label>Select demo: </label>
            <select
              onChange={(ev: any) => startDemo(ev.target.value)}
              value={demoIdx}
              autoFocus={true}
            >
              {options}
            </select>
            <div>
              <h4>Example: {getProps().demos[demoIdx][0]}</h4>
              {getProps().demos[demoIdx][1]}
            </div>
          </div>
        </div>
      )
    }
  }
})

// --- Component Demo -----------------------------------------------

type DemoAppProps = {
  demos: [string, VirtualNode][]
}

const DemoApp: any = component<DemoAppProps>({
  displayName: 'DemoApp',

  render(props) {
    return (
      <div>
        <DemoSelector demos={props.demos}/>
      </div>
    )
  }
})

function getCurrentDemoIndex() {
  return parseInt(document.location.href.replace(/^.*idx=/, ''), 10) || 0
}

// --- main ---------------------------------------------------------

mount(<DemoApp demos={availableDemos}/>, 'main-content')
