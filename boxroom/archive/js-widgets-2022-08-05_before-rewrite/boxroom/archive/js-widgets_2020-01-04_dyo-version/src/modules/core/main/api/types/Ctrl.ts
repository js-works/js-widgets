import Context from './Context'
import Props from './Props'

type Listener = () => void
type Unsubscribe = () => void
type Updater<T> = T | ((oldValue: T) => T)

export default interface Ctrl {
  handleState<T>(initialValue: T): [() => T, (updater: Updater<T>) => void],
  consumeContext<T>(ctx: Context<T>): () => T,
  onWillRender(listener: Listener): Unsubscribe,
  onDidUpdate(listener: Listener): Unsubscribe,
  onWillUnmount(listener: Listener): Unsubscribe,
  // plus some more methods (mostly for lifecycle)
}
