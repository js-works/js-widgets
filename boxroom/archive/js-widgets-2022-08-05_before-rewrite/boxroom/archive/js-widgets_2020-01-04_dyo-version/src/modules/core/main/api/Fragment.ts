import h from './h'
import component from './component'
import Component from './types/Component'
import FragmentEntity from '../internal/adapt/FragmentEntity'

type FragmentProps = {
  key?: number | string,
  children?: any // TODO
}

const Fragment = component<FragmentProps>({
  displayName: 'Fragment',

  render(props) {
    const { children, ...propsWithoutChildren } = props

    return h(Fragment as any, propsWithoutChildren, ...children)
  }
}) as Component<FragmentProps>

Object.defineProperty(Fragment, '__internal_type', {
  value: FragmentEntity 
})

export default Fragment
