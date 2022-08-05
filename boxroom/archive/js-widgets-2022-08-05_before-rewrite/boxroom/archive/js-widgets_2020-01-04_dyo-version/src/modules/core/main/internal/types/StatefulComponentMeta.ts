import Ctrl from '../../api/types/Ctrl'
import Props from '../../api/types/Props'
import VirtualNode from '../../api/types/VirtualNode'

type StatefulComponentMeta<P extends Props = {}> = {
  displayName: string,
  init(c: Ctrl, getProps: () => P): (props: P) =>  VirtualNode,
}

export default StatefulComponentMeta
