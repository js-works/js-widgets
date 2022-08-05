import { Component, Context } from '../../../core/main/index'

export default function useProps<P>(c: Component<P>): () => P {
  return () => c.getProps()
}
