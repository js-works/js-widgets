import { render, VElement } from '../modules/core/main/index'

export function demo(content: VElement) {
  return () => {
    const elem = document.createElement('div')

    render(content, elem)

    return elem
  }
}
