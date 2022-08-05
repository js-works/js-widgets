# jsScenery

Research project to evaluate and implement a working UI library abstraction API. 

[![Licence](https://img.shields.io/badge/licence-LGPLv3-blue.svg?style=flat)](https://github.com/js-works/js-scenery/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/js-scenery.svg?style=flat)](https://www.npmjs.com/package/js-scenery)
[![Build status](https://travis-ci.com/js-works/js-scenery.svg)](https://travis-ci.org/js-works/js-scenery)
[![Coverage status](https://coveralls.io/repos/github/js-works/js-scenery/badge.svg?branch=master)](https://coveralls.io/github/js-works/js-scenery?branch=master)

**Remark: This README document is just an early draft - totally incomplete yet**

### Installation

```
# To download project and dependences
git clone https://github.com/js-works/js-scenery.git
cd js-scenery
npm install

# To run tests
npm run test

# To run tests with watching
npm run test-watch

# To start the demos
npm run demo

# To build the project
npm run build

# To build and prepare the project for publishing
npm run dist
```

### Introduction

jsScenery is a R&D project to find a modern ECMAScript API
where components can be defined in quite a pure way.
Be aware that jsScenery is only for research purposes, it is
NOT meant to be used in real-world applications.

First, here's a small demo application to get a glimpse of how components
are currently implemented with jsScenery:

#### Hello world component (pure ECMAScript)

```jsx
import { createElement, component, mount } from 'js-scenery'
import 'js-scenery/adapt-react' // to use React under the hood

const HelloWorld = component({
  displayName: 'HelloWorld',

  render({ name = 'World' }) {
    return div(`Hello, ${name}!`)
  }
})

mount(<HelloWorld/>, 'app')
```

#### Simple counter

```jsx
import { h, component, mount } from 'js-scenery'
import { useProps, useStateObject, useOnUpdate } from 'js-scenery/hooks'
import { wrapByProxies } from 'js-scenery/wrapByProxies'
import 'js-scenery/adapt-react' // to use React under the hood

// A 3rd-party general purpose validation library.
import { Spec } from 'js-spec'; 

const Counter = component({
  displayName: 'Counter',

  validate: Spec.checkProps({
    optional: {
      initialValue: Spec.integer,
      label: Spec.string
    }
  }),

  defaultProps: {
    initialValue: 0,
    label: 'Counter'
  },

  *init() {
    const
      getProps = yield useProps(),
      [getState, setState] = yield useStateObject({ count: getProps().initialValue }),
      [props, state, using] = wrapByProxies(getProps, getState),
      onIncrement = () => setState({ count: state.count + 1 })

      yield onUpdate(() => {
        console.log(`Component has been updated => ${props.label}: ${state.count}`)
      })

      return using((props, state) => { // no need to use proxies in render function => unwrap
        <div>
          <label>{props.label}</label>
          <button onClick={onIncrement}>{state.count}</button>
        </div>
      })
    }
  }
})

mount(<Counter/>, 'app')
```

### Designated API (not complete yet)

#### Module "_js-scenery_"

Basics:
* `h(type, props?, ...children)`
* `component(componentConfig)`
* `context(contextConfig)`
* `mount(content, container)`
* `unmount(container)`
* `Fragment`
* `Boundary`

Helper functions for virtual elements and nodes
* `isElement(it)`
* `isNode(it)`
* `propsOf(element)`
* `typeOf(element)`

Helper functions for children
* `childCount(children)`
* `forEachChild(children, callback)`
* `mapChildren(children, mapper)`
* `onlyChild(children)`
* `toChildArray(children)`
* `withChildren(f)`

#### Module "_js-scenery/hooks_"

* `useCallback(callback)`
* `useContext(ctx)`
* `useEffect(action, dependencies?)`
* `useForceUpdate()`
* `useMethods(ref, getter, inputs)`
* `usePrevious(value)`
* `useRef(initialValue)`
* `useState(initialValue | initialValueProvider)`

#### Module "_js-scenery/util"

* `wrapByProxies(...getters)`

### Project status

**Important**: This project is in a very early pre-alpha state.
