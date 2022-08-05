import VirtualNode from '../../api/types/VirtualNode'

type ContextProviderProps<T> = {
  value: T,
  children?: VirtualNode
}

export default ContextProviderProps
