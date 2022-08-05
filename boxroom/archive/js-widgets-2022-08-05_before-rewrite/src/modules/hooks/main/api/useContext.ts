import { Context, Ctrl } from '../../../core/main/index'
import hook from './hook'

function useContext<T>(c: Ctrl, ctx: Context<T>): { value: T } {
  const
    getContext = c.consumeContext(ctx),
    ret = { value: getContext() }
  
  c.beforeUpdate(() => {
    ret.value = getContext()
  })

  return ret
}

export default hook('useContext', useContext)
