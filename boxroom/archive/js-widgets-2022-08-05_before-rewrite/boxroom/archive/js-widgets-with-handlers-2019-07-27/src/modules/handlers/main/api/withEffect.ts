import { Component } from '../../../core/main/index'

// TODO: Real implementation is missing

export default function withEffect<T, A extends any[]>(c: Component, f: (...args: A) => void):
  (...args: A) => void {
  
  return f
}
