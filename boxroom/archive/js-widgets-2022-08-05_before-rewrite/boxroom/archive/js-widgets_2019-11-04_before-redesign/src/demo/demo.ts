import { component, mount, useForceUpdate, Component, VirtualElement } from '../modules/root/main/index'
import { div, h4, label, option, select } from '../modules/html/main/index'

import availableDemos from './available-demos'

// --- Component DemoSelector ---------------------------------------

type DemoSelectorProps = {
  demos: [string, VirtualElement][]
}

const DemoSelector: Component<DemoSelectorProps> = component({
  displayName: 'DemoSelector',

  main({ update }) {
    let demoIdx = getCurrentDemoIndex()

    function startDemo(idx: number) {
      demoIdx = idx
      document.location.href = document.location.href.replace(/#.*$/, '') + '#idx=' + idx
      update()
    }

    return props => {
      const options: VirtualElement[] = []

      for (let i = 0; i < props.demos.length; ++i) {
        const demo = props.demos[i]
            
        options.push(option({ key: i, value: i }, demo[0]))
      }

      return (
        div(null,
          div(null,
            label(null, 'Select demo: '),
              select({
                onChange: (ev: any) => startDemo(ev.target.value),
                value: demoIdx,
                autoFocus: true
              }, options)),
              div(null,
                h4(null, 'Example: ', props.demos[demoIdx][0]),
                props.demos[demoIdx][1])))
    }
  }
})

// --- Component Demo -----------------------------------------------

type DemoProps = {
  demos: [string, VirtualElement][]
}

const Demo: Component<DemoProps> = component({
  displayName: 'Demo',

  render(props) {
    return (
      div(null,
        DemoSelector({ demos: props.demos }))
    )
  }
})

function getCurrentDemoIndex() {
  return parseInt(document.location.href.replace(/^.*idx=/, ''), 10) || 0
}

// --- main ---------------------------------------------------------

mount(Demo({ demos: availableDemos }), 'main-content')
