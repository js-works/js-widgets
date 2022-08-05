import ComponentFactory from './ComponentFactory'
import AltComponentFactory from './ComponentFactory'
import Props from './Props'
import Key from './Key'

interface VirtualElement {
  type: string | ComponentFactory | AltComponentFactory,
  props: Props | null,
  key: Key,
}

export default VirtualElement
