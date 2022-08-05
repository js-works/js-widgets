import useState from './useState'

export default function* useForceUpdate() {
  const [, setState] = yield useState(false)

  return () => setState((it: boolean) => !it)
}
