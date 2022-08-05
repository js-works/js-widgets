import Context from './Context'
import Props from './Props'

type Listener = () => void
type Unsubscribe = () => void
type Updater<T> = T | ((oldValue: T) => T)

export default interface Ctrl<P extends Props = {}> {
  consumeProps(): () => P,
  handleState<T>(initialValue: T): [() => T, (updater: Updater<T>) => void],
  consumeContext<T>(ctx: Context<T>): () => T,
  onUpdate(listener: Listener): Unsubscribe,
  onUnmount(listener: Listener): Unsubscribe,
  // plus some more methods (mostly for lifecycle)
}
