import { h, component, useMousePosition } from '../../modules/root/main/index'

const Demo = component({
  displayName: 'Demo',

  main(c) {
    const mousePos = useMousePosition(c)

    return () => {
      return mousePos.x === -1
        ? <div>Please move mouse ...</div>
        : <div>
            Current mouse position: {mousePos.x}x{mousePos.y}
          </div>
    }
  }
})

export default <Demo/>
