import { Ref } from '../../../core/main/index'

export default function asRef<T>(getter: () => T): Ref<T> {
  return {
    get current() {
      return getter()
    }
  }
}
