import { h, component, useMousePosition } from '../../modules/root/main/index'

const Demo = component({
  displayName: 'Demo',

  main({ c }) {
    const [$mouseX, $mouseY] = useMousePosition(c)

    return () => {
      return $mouseX.value === -1
        ? <div>Please move mouse ...</div>
        : <div>
            Current mouse position: {$mouseX.value}x{$mouseY.value}
          </div>
    }
  }
})

export default <Demo/>
