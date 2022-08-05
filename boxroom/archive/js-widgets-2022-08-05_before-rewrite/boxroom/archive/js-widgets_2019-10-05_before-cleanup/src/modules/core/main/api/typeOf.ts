import Fragment from './Fragment'
import Boundary from './Boundary'
import Elements from '../internal/adapt/Elements'
import FragmentEntity from '../internal/adapt/FragmentEntity'
import BoundaryEntity from '../internal/adapt/BoundaryEntity'

export default function typeOf(it: any) {
  let ret = undefined

  const internalType = Elements.getType(it)

  if (typeof internalType === 'string') {
    ret = internalType
  } else if (internalType === FragmentEntity) {
    ret = Fragment
  } else if (internalType === BoundaryEntity) {
    ret = Boundary
  } else if (internalType) {
    ret = (internalType as any).__internal_original
  }

  return ret
}

