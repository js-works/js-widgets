import Props from './Props'
import VirtualNode from './VirtualNode'

type StatelessComponentMeta<P extends Props = {}> = {
  type: 'statelessComponent',
  displayName: string,
  defaults: Partial<P> | null,
  validate: ((props: P) => null | Error | true | false) | null,
  memoize: boolean,
  render(props: P): VirtualNode,
}

export default StatelessComponentMeta
