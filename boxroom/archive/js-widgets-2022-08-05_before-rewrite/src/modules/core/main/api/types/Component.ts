import Props from './Props'
import StatelessComponent from './StatelessComponent'
import StatefulComponent from './StatefulComponent'

type Component<P extends Props = {}> =
  StatelessComponent<P> | StatefulComponent<P>

export default Component
