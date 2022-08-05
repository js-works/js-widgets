import h from './h'
import component from './component'
import Component from './types/Component'
import BoundaryEntity from '../internal/adapt/BoundaryEntity'

type BoundaryProps = {
  key?: number | string,
  fallback: Function, // TODO
  children?: any // TODO
}

const Boundary = component<BoundaryProps>({
  displayName: 'Boundary',

  render(props) {
    const { children, ...props2 } = props

    return h(Boundary as any, props2, ...children)
  }
}) as Component<BoundaryProps>

Object.defineProperty(Boundary, '__internal_type', {
  value: BoundaryEntity 
})

export default Boundary
