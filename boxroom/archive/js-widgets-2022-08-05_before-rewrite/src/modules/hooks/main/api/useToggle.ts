import { Ctrl } from '../../../core/main/index'
import hook from './hook'
import useValue from './useValue'

function useToggle(c: Ctrl, initialValue: boolean = false): [{ value: boolean }, () => void] {
  const [value, setValue] = useValue(c, initialValue)

  return [value, () => setValue(it => !it)]
}

export default hook('useToggle', useToggle)
