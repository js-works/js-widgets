import ContextMeta from './ContextMeta'

type Context<T> = {
  readonly meta: ContextMeta<T>
}

export default Context
