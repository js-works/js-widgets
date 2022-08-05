// imports
import { Ctrl } from '../../../core/main/index'

// --- componentStore -------------------------------------------------

function componentStore<
  S extends State,
  M extends Store 
>(
  initStore: StoreInitializer<S, M>
): (c: Ctrl, initialState: S) => M

function componentStore<
  S extends State,
  M extends Store, 
  A extends any[],
>(
  initStore: StoreInitializer<S, M>,
  initState: StateInitializer<S, A>
): (c: Ctrl, ...args: A) => M 

function componentStore(initStore: Function, initState?: Function): Function {
  return function useStore(c: Ctrl, ...args: any[]): any {
    const
      [getState, setState] = c.handleState(
        initState ? initState.apply(null, args) : args[0]),
      
      updater = (update: any) => {
        if (typeof update === 'function') {
          setState((prevState: any) =>
            Object.assign({}, prevState, update(prevState)))
        } else {
          setState((prevState: any) =>
            Object.assign({}, prevState, update))
        }
      },

      store = initStore(
        createStateProxy(getState),
        updater,
        getState
      )

    return store 
  }
}

// --- locals -------------------------------------------------------

type State = { [key: string]: any }
type Store = { [k: string]: (...args: any[]) => any }
type StateUpdate<S extends State> = Partial<S> | ((state: S) => Partial<S>)
type StateSetter<S extends State> = (update: StateUpdate<S>) => void
type StateGetter<S extends State> = () => S

type StoreInitializer<S extends State, M extends Store> =
  (state: S, setState: StateSetter<S>, getState: StateGetter<S>) => M

type StateInitializer<S extends State, A extends any[]> =
  (...args: A) => S

function createStateProxy<S extends State>(getState: () => S): S {
  const ret: any = {}
  
  for (const k of Object.keys(getState())) {
    Object.defineProperty(ret, k, {
      get: () => getState()[k]
    })
  }

  return ret
}

// --- exports ------------------------------------------------------

export default componentStore
