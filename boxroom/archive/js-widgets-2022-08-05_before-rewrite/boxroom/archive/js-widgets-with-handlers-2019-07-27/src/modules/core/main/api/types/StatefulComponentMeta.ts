import Component from './Component'
import Props from './Props'
import VirtualNode from './VirtualNode'

type StatefulComponentMeta<P extends Props = {}> = {
  type: 'statefulComponent',
  displayName: string,
  defaults: Partial<P> | null,
  validate: ((props: P) => null | Error | true | false) | null,
  init: (c: Component<P>, getProps: () => P) => (props: P) =>  VirtualNode,
  memoize: boolean,
  render: never
}

export default StatefulComponentMeta
