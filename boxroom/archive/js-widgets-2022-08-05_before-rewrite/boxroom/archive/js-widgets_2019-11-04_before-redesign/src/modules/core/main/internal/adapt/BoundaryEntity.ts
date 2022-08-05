import { h, Boundary } from 'dyo'

export default function(props: any) {
  let props2 = props

  if (props.fallback) {
    const fallback = props.fallback

    props2 = { ...props }

    props2.fallback = (error: any) => {
      return fallback(error.message)
    }
  }

  return h(Boundary as any, props2) // TODO
}
