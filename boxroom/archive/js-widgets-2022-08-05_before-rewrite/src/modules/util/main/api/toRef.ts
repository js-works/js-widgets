import { Ref } from '../../../core/main/index'

export default function toRef<T>(arg?: T | Ref<T>): Ref<T> {
  let ret: Ref<T>

  if (arg && typeof arg === 'object'
    && Object.prototype.hasOwnProperty.call(arg, 'current')) {

      ret = arg as Ref<T>
  } else {
    ret = {
      current: arg as T
    }
  }

  return ret
}
