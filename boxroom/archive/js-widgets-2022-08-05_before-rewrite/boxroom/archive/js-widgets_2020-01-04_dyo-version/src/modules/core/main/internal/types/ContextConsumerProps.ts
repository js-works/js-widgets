import VirtualNode from '../../api/types/VirtualNode'

type ContextConsumerProps<T> = {
  children?: (value: T) => VirtualNode
}

export default ContextConsumerProps
