import { Ctrl } from '../../../core/main/index'

export default function useForceUpdate(c: Ctrl) {
  const [getState, setState] = c.handleState(false)
  
  return () => setState(!getState()) 
}
