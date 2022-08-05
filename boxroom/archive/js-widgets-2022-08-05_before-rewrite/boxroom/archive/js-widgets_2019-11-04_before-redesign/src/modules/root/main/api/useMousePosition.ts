import { Ctrl } from '../../../core/main/index'

import useState from './useState'
import useOnMount from './useOnMount'

type MousePosition = {
  x: number,
  y: number
} | null

export default function useMousePosition(c: Ctrl) {
  const
    [$mouseX, setMouseX] = useState(c, -1),
    [$mouseY, setMouseY] = useState(c, -1)

  useOnMount(c, () => {
    const listener = (ev: any) => {
      setMouseX(ev.pageX)
      setMouseY(ev.pageY)
    }

    window.addEventListener('mousemove', listener)

    return () => {
      window.removeEventListener('mousemove', listener)
    }
  })

  return [$mouseX, $mouseY]
}
