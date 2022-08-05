import Props from './Props'
import VirtualNode from './VirtualNode'

type ComponentConfig<P extends Props> = {
  displayName: string,
  memoize?: boolean,
  validate?(props: P): boolean | null | Error
  init(): Generator<any, any, any> // TODO
}

export default ComponentConfig