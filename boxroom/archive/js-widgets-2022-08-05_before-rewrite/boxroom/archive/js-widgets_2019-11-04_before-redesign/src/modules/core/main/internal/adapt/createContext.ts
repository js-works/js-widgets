import { h, useContext, Context } from 'dyo'

export default function createContext(defaultValue: any) {
  const
    Provider = ({ value, key, children }: any): any => {
      return h(Context, { value, key }, children)
    },

    Consumer = ({ props, children }: any): any => {
      let value: any = useContext(Provider)

      if (value === undefined) {
        value = defaultValue
      }

      return children(value)
    }

  Object.defineProperty(Provider, '__internal_defaultContextValue', {
    value: defaultValue 
  })

  return { Provider, Consumer }
}
