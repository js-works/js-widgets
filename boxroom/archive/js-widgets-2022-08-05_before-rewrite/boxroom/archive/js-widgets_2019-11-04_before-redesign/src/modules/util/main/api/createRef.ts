export default function createRef<T = any>(value?: T) {
  return { current: value }
}
