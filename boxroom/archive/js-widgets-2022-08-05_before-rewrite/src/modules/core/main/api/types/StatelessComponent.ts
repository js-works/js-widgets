import Props from '../../api/types/Props'
import Key from '../../api/types/Key'
import VElement from '../../api/types/VElement'
import VNode from '../../api/types/VNode'
import StatelessComponentMeta from './StatefulComponentMeta'

type StatelessComponent<P extends Props = {}> = {
  (props?: P & { key?: Key }, ...childre: VNode[]): VElement<P>
  readonly meta: StatelessComponentMeta<P>
}

export default StatelessComponent
