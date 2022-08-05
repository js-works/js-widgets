import Context from './Context'
import Props from './Props'

type Listener = () => void
type Unsubscribe = () => void
type Updater<T> = T | ((oldValue: T) => T)

export default interface Component<P extends Props = {}> {
  getProps(): P,
  isMounted(): boolean,
  handleState<T>(initialValue: T): [() => T, (updater: Updater<T>) => void],
  consumeContext<T>(ctx: Context<T>): () => T,
  forceUpdate(): void,
  onUpdate(listener: Listener): Unsubscribe,
  onUnmount(listener: Listener): Unsubscribe,
  // plus some more methods (mostly for lifecycle)
}
