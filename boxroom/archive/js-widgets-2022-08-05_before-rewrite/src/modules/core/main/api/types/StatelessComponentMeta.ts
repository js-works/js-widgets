import Props from '../../api/types/Props'
import VNode from '../../api/types/VNode'

type StatelessComponentMeta<P extends Props> = {
  readonly type: 'component',
  readonly name: string,
  readonly stateful: false,
  readonly memo: boolean, // TODO
  readonly validation: null | ((props: P) => boolean | null | Error),
  readonly render: (props: P) => VNode 
}

export default StatelessComponentMeta
