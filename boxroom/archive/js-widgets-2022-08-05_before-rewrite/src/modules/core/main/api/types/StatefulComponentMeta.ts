import Props from '../../api/types/Props'
import Ctrl from '../../api/types/Ctrl'
import VNode from '../../api/types/VNode'

type StatefulComponentMeta<P extends Props> = {
  readonly type: 'component',
  readonly name: string,
  readonly stateful: true,
  readonly memo: boolean // TODO
  readonly validation: null | ((props: P) => boolean | null | Error),
  readonly init: (c: Ctrl<P>) => (props: P) => VNode
}

export default StatefulComponentMeta
