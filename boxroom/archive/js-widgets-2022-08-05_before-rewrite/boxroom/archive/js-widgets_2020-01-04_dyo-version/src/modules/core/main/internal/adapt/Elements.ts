import { isValidElement } from 'dyo'

export default {
  getType(it: any) {
    return isValidElement(it) ? it.type : undefined
  },

  getProps(it: any) {
    return isValidElement(it) ? it.props : undefined
  }
}
