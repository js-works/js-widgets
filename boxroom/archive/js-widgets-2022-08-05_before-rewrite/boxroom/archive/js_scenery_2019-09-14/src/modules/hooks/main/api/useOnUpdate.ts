export default function* useOnUpdate(action: () => any) {
  yield { type: 'onUpdate', action }
}
