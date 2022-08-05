type ContextMeta<T> = {
  readonly type: 'context',
  readonly name: string,
  readonly validate: null | ((value: T) => boolean | null | Error),
  readonly default: T
}

export default ContextMeta
