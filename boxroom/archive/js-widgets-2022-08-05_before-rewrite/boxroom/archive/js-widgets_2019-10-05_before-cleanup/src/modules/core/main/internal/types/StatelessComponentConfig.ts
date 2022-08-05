import Props from '../../api/types/Props'
import VirtualNode from '../../api/types/VirtualNode'

type StatelessComponentConfig<P extends Props = {}> = {
  displayName: string,
  memoize?: boolean,
  validate?: ((props: P) => boolean | null | Error) | null,
  render: (props: P) => VirtualNode,
}

export default StatelessComponentConfig
