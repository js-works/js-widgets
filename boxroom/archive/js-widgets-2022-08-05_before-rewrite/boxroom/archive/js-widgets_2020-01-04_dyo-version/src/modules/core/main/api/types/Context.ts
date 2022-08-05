import Component from './Component'
import VirtualNode from './VirtualNode'
import Key from './Key'

type ProviderProps<T> = {
  value: T,
  key?: Key,
  children?: VirtualNode
}

type ConsumerProps<T> = {
  key?: Key,
  children?: (value: T) => VirtualNode
}

type Context<T> = {
  Provider: Component<ProviderProps<T>>,
  Consumer: Component<ConsumerProps<T>>
}

export default Context
