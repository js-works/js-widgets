import { h } from '../../../core/main/index'

const VirtualElement = h('div').constructor

export default function isElement(it: any): boolean {
  return it && it.constructor === VirtualElement
}

Object.defineProperty(isElement, 'js-spec:validate', {
  value(it: any) {
    return isElement(it)
      ? null
      : new Error('Must be a valid element')
  }
})
