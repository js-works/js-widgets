import { Ctrl } from '../../../core/main/index'

import useState from './useState'
import useInterval from './useInterval'

export default function useTime(c: Ctrl, interval: number | (() => number) = 1000): () => Date {
  const [getTime, setTime] = useState(c, new Date())

  useInterval(c, () => setTime(new Date()), interval)

  return getTime
}
