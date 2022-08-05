import { component } from '../../modules/core/main/index'
import { div } from '../../modules/html/main/index'
import { Spec } from 'js-spec'

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
