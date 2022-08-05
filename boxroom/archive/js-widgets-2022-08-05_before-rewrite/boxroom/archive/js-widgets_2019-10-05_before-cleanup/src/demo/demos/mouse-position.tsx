import { h, component } from '../../modules/core/main/index'
import { useMousePosition } from '../../modules/hooks/main/index'

const Demo = component({
  displayName: 'Demo',

  init(c) {
    const getMousePosition = useMousePosition(c)

    return () => {
      const mousePosition = getMousePosition()

      return !mousePosition
        ? <div>Please move mouse ...</div>
        : <div>
            Current mouse position: {mousePosition.x}x{mousePosition.y}
          </div>
    }
  }
})

export default <Demo/>
