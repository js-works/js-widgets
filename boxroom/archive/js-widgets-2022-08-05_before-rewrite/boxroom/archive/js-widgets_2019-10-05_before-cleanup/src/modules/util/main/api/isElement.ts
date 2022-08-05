import { typeOf } from '../../../core/main/index'

export default function isElement(it: any): boolean {
  return !!typeOf(it)
}

Object.defineProperty(isElement, 'js-spec:validate', {
  value(it: any) {
    return !!typeOf(it)
      ? null
      : new Error('Must be a valid element')
  }
})
