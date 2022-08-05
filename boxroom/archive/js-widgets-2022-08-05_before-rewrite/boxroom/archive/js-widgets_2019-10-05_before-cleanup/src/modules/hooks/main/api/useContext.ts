import { Ctrl, Context } from '../../../core/main/index'

export default function useContext<T>(c: Ctrl, ctx: Context<T>) {
  return c.consumeContext(ctx)
}
