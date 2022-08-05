import Props from './Props'
import VNode from './VNode'

type StatelessComponentConfig<
  P extends Props = {}
> = {
  name: string,
  memoize?: boolean,
  validate?(props: P): boolean | Error | null,
  render(props: P): VNode
}

export default StatelessComponentConfig
