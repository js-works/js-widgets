import { Ctrl, Context } from '../../../core/main/index'
import useMutable from './useMutable'

export default function useContext<T>(c: Ctrl, ctx: Context<T>) {
  return useMutable(c, c.consumeContext(ctx))
}
