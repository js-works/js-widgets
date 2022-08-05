import Props from './Props'
import StatelessComponentMeta from './StatelessComponentMeta'
import StatefulComponentMeta from './StatefulComponentMeta'

type ComponentMeta<P extends Props = {}> =
  StatelessComponentMeta<P> | StatefulComponentMeta<P>

export default ComponentMeta
