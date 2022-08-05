import Props from '../../api/types/Props'
import VirtualNode from '../../api/types/VirtualNode'

type StatelessComponentMeta<P extends Props = {}> = {
  displayName: string,
  render(props: P): VirtualNode,
}

export default StatelessComponentMeta
