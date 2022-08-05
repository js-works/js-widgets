import createElement from './createElement'
import VirtualElement from './types/VirtualElement'
import StatelessComponentMeta from './types/StatelessComponentMeta'
import ComponentFactory from './types/ComponentFactory'

let createFragment: (...args: any[]) => VirtualElement = null!

type FragmentProps = {
  key?: number | string
}

function Fragment(props?: FragmentProps, ...args: any[]): VirtualElement {
  if (!createFragment) {
    createFragment = createElement.bind(null, Fragment as any)
  }

  return createFragment(...args)
}

export default Fragment as ComponentFactory<FragmentProps>


const meta: StatelessComponentMeta<{ key?: any }> = Object.freeze({
  displayName: 'Fragment',
  memoize: false,
  type: 'statelessComponent' as any,
  defaults: null,
  validate: null,
  render: Fragment
})

Object.defineProperty(Fragment, 'meta', {
  value: meta
})
