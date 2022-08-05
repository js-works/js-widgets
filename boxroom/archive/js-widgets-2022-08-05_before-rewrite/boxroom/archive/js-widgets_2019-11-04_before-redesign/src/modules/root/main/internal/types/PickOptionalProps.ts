type PickOptionalProps<T> = Pick<T, {
  [K in keyof T]: T extends Record<K, T[K]> ? never : K
}[keyof T]>

export default PickOptionalProps
