import { h, component, Boundary, useValue, useOnUpdate }  from '../../modules/root/main/index'

const ErrorTrigger = component({
  displayName: 'ErrorTrigger',

  main(c) {
    const
      [$errorMsg, setErrorMsg] = useValue<string | null>(c, null),
      onButtonClick = () => setErrorMsg('Simulated error!')

    useOnUpdate(c, () => {
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

const ErrorBoundary = component({
  displayName: 'ErrorBoundary',

  main(c) {
    const
      [$error, setError] = useValue<Error | null>(c, null),
      
      onReset = () => {
        setError(null)
      },

      onError = (error: any) => {
        console.log(error)
        setError(error)
      }

    return () => { 
      const error = $error.value

      return (
        <Boundary fallback={onError}>
          {
            error
              ? <div>
                  Catched error: <i>{error.message } </i>
                  <button onClick={onReset}>Reset</button>
                </div>
              : <ErrorTrigger/>
          }
        </Boundary>
      )
    }
  }
})

export default <ErrorBoundary/>
