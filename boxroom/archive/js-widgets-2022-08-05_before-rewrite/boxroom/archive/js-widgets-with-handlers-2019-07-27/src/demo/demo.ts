import { defineComponent, Component, VirtualElement } from '../modules/core/main/index'
import { useProps } from '../modules/hooks/main/index'
import { forceUpdate } from '../modules/util/main/index'
import { mount } from '../modules/dom/main/index'
import { div, h4, label, option, select } from '../modules/html/main/index'

import availableDemos from './available-demos'

// --- Component DemoSelector ---------------------------------------

type DemoSelectorProps = {
  demos: [string, VirtualElement][]
}

const DemoSelector = defineComponent<DemoSelectorProps>({
  displayName: 'DemoSelector',

  init(c) {
    let
      demoIdx = getCurrentDemoIndex()

    function startDemo(idx: number) {
      demoIdx = idx
      document.location.href = document.location.href.replace(/#.*$/, '') + '#idx=' + idx
      forceUpdate(c)
    }

    const
      getProps = useProps(c),
      options: VirtualElement[] = []

    for (let i = 0; i < getProps().demos.length; ++i) {
      const demo = getProps().demos[i]
          
      options.push(option({ key: i, value: i }, demo[0]))
    }

    return props => {
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

const Demo = defineComponent<DemoProps>({
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
