import { h, component, Ctrl } from '../../modules/core/main/index'
import { useTime } from '../../modules/hooks/main/index'

const Clock = component({
  displayName: 'Clock',
  memoize: true,

  init(c) {
    const getTime = useTime(c)

    return () => (
      <div>
        Current time: {getTime().toLocaleTimeString()}
      </div>
    )
  }
})

export default <Clock />
