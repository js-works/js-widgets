import Ctrl from './Ctrl'
import Props from './Props'
import VNode from './VNode'

type StatefulComponentConfig<
  P extends Props = {}
> = {
  name: string,
  memoize?: boolean,
  validate?(props: P): boolean | Error | null,
  init(c: Ctrl<P>): (props: P) => VNode
}

export default StatefulComponentConfig
