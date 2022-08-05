import { useContext } from 'dyo'

export default (ctx: any): any => {
  const { Provider } = ctx

  let ret = useContext(Provider)

  if (ret === undefined) {
    ret === Provider.__internal_defaultContextValue
  }

  return ret
}