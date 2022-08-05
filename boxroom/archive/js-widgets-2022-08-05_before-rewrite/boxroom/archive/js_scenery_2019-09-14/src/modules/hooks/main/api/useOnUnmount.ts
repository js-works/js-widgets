export default function* useOnUnmount(action: () => any) {
  yield { type: 'onUnmount', action }
}
