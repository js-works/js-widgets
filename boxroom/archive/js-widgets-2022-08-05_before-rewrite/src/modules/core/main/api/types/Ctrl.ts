import Context from './Context'
import Props from '../types/Props'

type Ctrl<P extends Props = {}> = {
  getName(): string,
  getProps(): P,
  isInitialized(): boolean,
  isMounted(): boolean,
  update(runOnceBeforeUpdate?: () => void): void,
  consumeContext<T>(ctx: Context<T>): () => T,
  afterMount(action: () => void): void,
  beforeUpdate(action: () => void): void,
  afterUpdate(action: () => void): void,
  beforeUnmount(action: () => void): void
}

export default Ctrl
