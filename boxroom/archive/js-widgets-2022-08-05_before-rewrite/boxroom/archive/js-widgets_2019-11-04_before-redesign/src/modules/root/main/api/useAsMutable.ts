import { Ctrl } from '../../../core/main/index'
import { createMutable, isMutable } from '../internal/tools/mutables'
import ValueOrMutable from './types/ValueOrMutable'

export default function useAsMutable<T>(
  c: Ctrl,
  varValue: ValueOrMutable<T>
): { value: T } {
  return isMutable(varValue) 
    ? varValue as any
    : createMutable(varValue)
}
