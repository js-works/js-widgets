// imports
import { Ctrl } from '../../../core/main/index'

// --- componentActions -----------------------------------------------

function componentActions<
  S extends State,
  M extends Actions, 
>(
  initActions: ActionsInitializer<S, M>
): (c: Ctrl, initialState: S) => [M, () => S]

function componentActions<
  S extends State,
  M extends Actions, 
  A extends any[],
>(
  initActions: ActionsInitializer<S, M>,
  initState: StateInitializer<S, A>
): (c: Ctrl, ...args: A) => [M, () => S] 

function componentActions(initActions: Function, initState?: Function): Function {
  return function useActions(c: Ctrl, ...args: any[]): any {
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

      actions = initActions(
        createStateProxy(getState),
        updater,
        getState
      )

    return [actions, getState]
  }
}

// --- locals -------------------------------------------------------

type State = { [key: string]: any }
type Actions = { [k: string]: (...args: any[]) => void }
type StateUpdate<S extends State> = Partial<S> | ((state: S) => Partial<S>)
type StateSetter<S extends State> = (update: StateUpdate<S>) => void
type StateGetter<S extends State> = () => S

type ActionsInitializer<S extends State, M extends Actions> =
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

export default componentActions
