export default function* useContext(context: any) { // TODO
  const getValue = yield { type: 'useContext', context }

  return getValue
}