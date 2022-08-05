import { Ctrl } from '../../../core/main/index'
import { createMutable } from '../internal/tools/mutables'

export default function useMutable<T>(c: Ctrl, getValue: () => T): { value: T } {
  const ret = createMutable(getValue())

  c.onWillRender(() => {
    ret.value = getValue()
  })

  return ret
}
