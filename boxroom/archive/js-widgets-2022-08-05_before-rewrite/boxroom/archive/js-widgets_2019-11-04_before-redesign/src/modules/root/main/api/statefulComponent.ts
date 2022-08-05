import { component, Component, Ctrl, Props, VirtualElement } from '../../../core/main/index'

export default function statefulComponent<P extends Props>(
  displayName: string,
  init: (c: Ctrl<P>) => (props: P) => VirtualElement
): Component<P> {
  return component({
    displayName,
    init
  })
}
