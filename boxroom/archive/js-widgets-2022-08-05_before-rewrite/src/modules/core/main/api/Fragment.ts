import { h as createDyoElement, Fragment as DyoFragment } from 'dyo'
import h from './h'
import setHiddenProp from '../internal/setHiddenProp'
import convertNode from '../internal/convertNode'
import component from './component'
import VNode from './types/VNode'
import Component from './types/Component'

type FragmentProps = {
  children?: VNode 
}

const Fragment: Component<FragmentProps> = component({
  name: 'Fragment',

  render(props) {
    const { children, ...propsWithoutChildren } = props

    return h(Fragment, propsWithoutChildren, ...children)
  }
})

setHiddenProp(Fragment, '__type', ({ children, key }: any) => {
  const props = key !== undefined ? { key } : null

  return createDyoElement(DyoFragment, props, convertNode(children))
})

export default Fragment
