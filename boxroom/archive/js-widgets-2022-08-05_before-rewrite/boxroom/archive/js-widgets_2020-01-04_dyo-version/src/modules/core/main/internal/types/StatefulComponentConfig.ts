import Props from '../../api/types/Props'
import VirtualNode from '../../api/types/VirtualNode'
import Ctrl from '../../api/types/Ctrl'

type StatefulComponentConfig<P extends Props = {}> = {
  displayName: string,
  memoize?: boolean,
  validate?: ((props: P) => boolean | null | Error) | null,
  init: (c: Ctrl, getProps: () => P) => (props: P) => VirtualNode,
}

export default StatefulComponentConfig 
