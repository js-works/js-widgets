import { createElement, defineComponent } from '../../../modules/core/main/index'

type SayHelloProps = {
  name?: string
}

const SayHello = defineComponent<SayHelloProps>({
  displayName: 'Counter',
  memoize: true,

  render({ name = 'world'}) {
    return <div>Hello, {name}!</div>
  }
})

export default
  <div>
    <SayHello/>
    <SayHello name="Jane Doe"/>
  </div>
