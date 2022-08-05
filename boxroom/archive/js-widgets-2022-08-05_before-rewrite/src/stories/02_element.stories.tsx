import { demo } from './utils'
import { component, h, Boundary, Fragment } from '../modules/core/main/index'
import { useEffect, useValue } from '../modules/hooks/main/index'

export default {
  title: 'Elements'
}

const FragmentDemo = component({
  name: 'FragmentDemo',

  render() {
    return (
      <Fragment>
        <div>
          This text line is an element inside of a fragment.
        </div>
        <div>
          This text line is another element inside of the same fragment.
        </div>
        <hr/>
        <div>
          <h4>A simple fragment test with a select box:</h4>
          <select><Options/></select>
        </div>
      </Fragment>
    )
  }
})

const Options = component({
  name: 'Options',

  render() {
    return (
      <Fragment>
        <option>Option #1</option>
        <option>Option #2</option>
        <option>Option #3</option>
      </Fragment>
    )
  }
})

const demoContent = {
  [Symbol.iterator]: function * () {
    yield 'I'
    yield 't'
    yield 'e'
    yield 'r'
    yield 'a'
    yield 't'
    yield 'o'
    yield 'r'
    yield 's'

    yield {
      [Symbol.iterator]: function * () {
        yield ' '
        yield 'seem'
        yield ' '
        yield 'to'
        yield ' '
      }
    }

    yield 'w'
    yield 'o'
    yield ['r', 'k', ' ', 'p', {
      [Symbol.iterator]: function * () {
        yield 'r'
        yield 'operly!'
      }
    }]
  }
}

const IteratorDemo = component({
  name: 'IteratorDemo',

  render() {
    return (
      <div>
        <div>
            If everything works fine then the following line shall be:
            "<i>Iterators seem to work properly!</i>"
        </div>
        <br/>
        <div>&gt;&gt; {demoContent}</div>
      </div>
    )
  }
})

// ===================================================================

const ErrorTrigger = component({
  name: 'ErrorTrigger',

  init(c) {
    const
      [$errorMsg, setErrorMsg] = useValue<string | null>(c, null),
      onButtonClick = () => setErrorMsg('Simulated error!')

    useEffect(c, () => {
      const errorMsg = $errorMsg.value

      if (errorMsg) {
        throw new Error(errorMsg)
      }
    })

    return () => (
      <button onClick={onButtonClick}>
        Click to trigger errror
      </button>
    )
  }
})

const BoundaryDemo = component({
  name: 'BoundaryDemo',

  init(c) {
    const
      [error, setError] = useValue<Error | null>(c, null),
      
      onReset = () => {
        setError(null)
      },

      onError = (error: any) => {
        setError(error)
      }

    return () => { 
      const cause = error.value

      return (
        <Boundary fallback={onError}>
          {
            cause
              ? <div>
                  Catched error: <i>{cause.message } </i>
                  <button onClick={onReset}>Reset</button>
                </div>
              : <ErrorTrigger/>
          }
        </Boundary>
      )
    }
  }
})

// --- exports -------------------------------------------------------

export const fragments = demo(<FragmentDemo/>)
export const boundary = demo(<BoundaryDemo/>)
export const iterators = demo(<IteratorDemo/>)
