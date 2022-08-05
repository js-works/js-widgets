interface ContextConfig<T> {
  displayName: string,
  validate?: (value: T) => boolean | null | Error
  default: T
}

export default ContextConfig
