export default function* useProps() {
  const getProps = yield { type: 'useProps' }

  return getProps
}
