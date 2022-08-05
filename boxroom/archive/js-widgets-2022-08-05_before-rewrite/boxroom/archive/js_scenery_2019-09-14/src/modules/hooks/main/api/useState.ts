export default function* useState<T>(initialValue: T): any {
  const [getState, setState] = yield { type: 'useState', initialValue }

  return [getState, setState]
}