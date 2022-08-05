import { Ctrl } from '../../../core/main/index'

export default function useMutableData<T>(c: Ctrl, getData: () => T): T {
  const ret: T = new MutableData() as T

  Object.assign(ret, getData())

  c.onWillRender(() => {
    clearObject(ret)
    Object.assign(ret, getData())
  })

  return ret
}

class MutableData {
}

function clearObject<T>(obj: T) {
  for (const key in obj) {
    delete obj[key]
  }
}
