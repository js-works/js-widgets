import { component, Component } from '../../modules/core/main/index'
import { div } from '../../modules/html/main/index'
import * as Spec from 'js-spec/validators'

type SayHelloProps = {
  name?: string
}

const SayHello = component<SayHelloProps>({
  displayName: 'SayHello',
  memoize: true,

  validate: Spec.checkProps({
    optional: {
      name: Spec.string
    }
  }),

  render({ name = 'world' }) {
    return div(`Hello, ${name}!`)
  }
})

export default
  div(null,
    SayHello(),
    SayHello({ name: "Jane Doe" }))
