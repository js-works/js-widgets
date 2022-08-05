export function createMutable<T>(initialValue: T) {
  return new Mutable(initialValue) 
}

export function isMutable(it: any) {
  return it instanceof Mutable
}

class Mutable<T> {
  constructor(public value: T) {
  }

  valueOf(): T {
    return this.value
  }
}
