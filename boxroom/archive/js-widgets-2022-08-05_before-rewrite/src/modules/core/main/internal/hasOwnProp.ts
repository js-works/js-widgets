export default function hasOwnProp(obj: any, propName: string) {
  return Object.prototype.hasOwnProperty.call(obj, propName)
}
