// internal imports
import Boundary from './Boundary'
import Fragment from './Fragment'
import Props from './types/Props'
import Component from './types/Component'
import VirtualElement from './types/VirtualElement'

// --- h ------------------------------------------------------------

function h<P extends Props>(
  type: string | Component<P>, ...children: any[]): VirtualElement<P>

function h(/* arguments */): any {
  let ret: any

  const f = (h as any).__apply

  if (!f) {
    throw new Error('[createElement] Adapter has not been initialized')
  }

  if (arguments[0] === Fragment) {
    const
      fragment = (h as any).__fragment,
      newArgs = [...arguments]

    if (fragment === undefined) {
      throw new Error('[createElement] Adapter has not been initialized')
    }

    newArgs[0] = fragment
    ret = f.apply(null, newArgs)
  } else if (arguments[0] === Boundary) {
    const
      boundary = (h as any).__boundary,
      newArgs = [...arguments]

    if (boundary === undefined) {
      throw new Error('[createElement] Adapter has not been initialized')
    }

    newArgs[0] = boundary
    ret = f.apply(null, newArgs)
  } else {
    ret = f.apply(null, arguments)
  }

  return ret
}

// --- exports ------------------------------------------------------

export default h