import Props from '../../api/types/Props'
import Key from '../../api/types/Key'
import VElement from '../../api/types/VElement'
import VNode from '../../api/types/VNode'
import StatefulComponentMeta from './StatefulComponentMeta'

type StatefulComponent<P extends Props = {}> = {
  (props?: P & { key?: Key }, ...children: VNode[]): VElement<P>
  readonly meta: StatefulComponentMeta<P>
}

export default StatefulComponent
