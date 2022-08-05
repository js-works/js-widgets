export default function isSameArray(arr1: any[], arr2: any[]) {
  let ret = false

  if (arr1.length === arr2.length) {
    let i: number = 0

    for (i; i < arr1.length; ++i) {
      if (arr1[i] !== arr2[i]) {
        break
      }
    }

    if (i === arr1.length) {
      ret = true
    }
  }

  return ret
}