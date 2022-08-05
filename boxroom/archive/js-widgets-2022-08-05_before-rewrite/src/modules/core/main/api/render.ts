import { render as dyoRender } from 'dyo'
import h from './h'
import VElement from './types/VElement'
import convertNode from '../internal/convertNode'

const VirtualElement = h('div').constructor

export default function render(
  content: VElement,
  container: Element | string
) {
  if (!content || content.constructor !== VirtualElement) {
    throw new TypeError(
      'First argument "content" of function "render" must be a virtual element')
  }

  if (!container || (typeof container !== 'string' && !container.tagName)) {
    throw new TypeError(
      'Second argument "container" of funtion "render" must either be a DOM element or selector string for the DOM element')
  }

  const target =
    typeof container === 'string'
      ? document.querySelector(container)
      : container

  if (!target) {
    throw new TypeError(
      `Could not find container DOM element "${container}"`)
  }

  dyoRender(convertNode(content), target)
}
