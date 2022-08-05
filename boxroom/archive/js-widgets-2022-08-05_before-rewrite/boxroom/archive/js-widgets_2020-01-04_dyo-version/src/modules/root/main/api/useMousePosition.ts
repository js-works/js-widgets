import { Ctrl } from '../../../core/main/index'

import useState from './useState'
import useOnMount from './useOnMount'

type MousePosition = {
  x: number,
  y: number
} | null

export default function useMousePosition(c: Ctrl) {
  const
    [mousePos, setMousePos] = useState(c, { x: -1, y: -1 })

  useOnMount(c, () => {
    const listener = (ev: any) => {
      setMousePos({ x: ev.pageX, y: ev.pageY })
    }

    window.addEventListener('mousemove', listener)

    return () => {
      window.removeEventListener('mousemove', listener)
    }
  })

  return mousePos
}
