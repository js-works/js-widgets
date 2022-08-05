import { demo } from './utils'
import { component, h, Component } from '../modules/core/main/index'
import * as Spec from 'js-spec/validators'

type SayHelloProps = {
  salutation?: string,
  name?: string
}

const SayHello = component<SayHelloProps>({
  name: 'Hello',

  validate: Spec.checkProps({
    optional: {
      salutation: Spec.string,
      name: Spec.string
    }
  }),

  render({
    salutation = 'Hello',
    name = 'world'
  }) {
    return <div>{salutation} {name}!</div>
  }
})

export default { title: 'HelloWorld' }

export const sayHello1 = demo(<SayHello/>)
export const sayHello2 = demo(<SayHello salutation="Hi" name="dude"/>)
export const sayHello3 = demo(SayHello({ salutation: 'Howdy', name: 'stranger' }))