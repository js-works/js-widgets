import VirtualElement from './VirtualElement'
import ComponentMeta from './ComponentMeta'
import Props from './Props'

type ExtProps<P extends Props> = P & {
  key?: string | number
}

export default interface ComponentFactory<P extends Props = {}> {
  (props?: ExtProps<P>, ...children: any[]): VirtualElement,
  meta: ComponentMeta<P>
}
