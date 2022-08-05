import { h, component, useTime, Ctrl } from '../../modules/root/main/index'

const Clock = component({
  displayName: 'Clock',
  memoize: true,

  init(c) {
    const $time = useTime(c, 1000, (date: Date) => date.toLocaleTimeString())

    return () => (
      <div>
        Current time: {$time}
      </div>
    )
  }
})

export default <Clock />
