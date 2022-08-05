type Ref<T> = (ref: T) => void | { current: T }

export default Ref
