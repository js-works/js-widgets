export default function setHiddenProp(obj: object, propName: string, value: any) {
  Object.defineProperty(obj, propName, {
    value
  })
}
