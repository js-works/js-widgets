import { Ctrl } from '../../../core/main/index'

import useState from './useState'
import useOnMount from './useOnMount'

type MousePosition = {
  x: number,
  y: number
} | null

export default function useMousePosition(c: Ctrl) {
  const [getMousePos, setMousePos] = useState(c, null as MousePosition)

  useOnMount(c, () => {
    const listener = (ev: any) => {
      const
        x = ev.pageX,
        y = ev.pageY

      setMousePos({ x, y })
    }

    window.addEventListener('mousemove', listener)

    return () => {
      window.removeEventListener('mousemove', listener)
    }
  })

  return getMousePos
}
