import type { ReactiveControllerHost, ReactiveController } from 'lit';
import { Context, Ref, RefObject } from 'preact';
import {
  intercept,
  ComponentCtrl,
  Props,
  ComponentCtrlGetter
} from 'preactive';

// === types =========================================================

type Action<A extends any[] = [], R = void> = (...args: A) => R;

type ContextType<C extends Context<any>> = C extends Context<infer T>
  ? T
  : never;

// === exports =======================================================

export {
  consume,
  create,
  createMemo,
  createTicker,
  effect,
  getRefresher,
  mutable,
  preset,
  optimizeUpdates,
  setDefaults,
  stateFn,
  stateObj,
  stateRef,
  stateVal,
  interval,
  handleMethods,
  handlePromise
};

// === types =========================================================

type Getter<T> = () => T;
type Updater<T, U = T> = Exclude<U, Function> | ((value: T) => U);
type Setter<T> = (updater: Updater<T>) => void;

type StateObjSetter<T extends Record<string, any>> = {
  (updater: Updater<T, Partial<T>>): void;
} & {
  [K in keyof T]: (updater: Updater<T[K]>) => void;
};

// === interception logic ============================================

let getCurrCtrl: ComponentCtrlGetter | null = null;

function getCtrl() {
  if (!getCurrCtrl) {
    throw Error('Extension has been called outside of component function');
  }

  return getCurrCtrl(2);
}

intercept({
  onInit(next, getCtrl) {
    try {
      getCurrCtrl = getCtrl;
      next();
    } finally {
      getCurrCtrl = null;
    }
  }
});

// === extensions ====================================================

// --- preset --------------------------------------------------------

function preset<P extends Props, D extends Partial<P>>(
  props: P,
  defaults: D | (() => D)
): P & D {
  const ret: any = {};
  const preactClass = (props as any)?.constructor?.__preactClass;

  if (typeof preactClass !== 'function') {
    throw new TypeError('Illegal first argument for function `preset`');
  }

  let defaultValues: D | null = null;
  const ctrl = getCtrl();

  if (typeof defaults !== 'function') {
    defaultValues = defaults;
  } else {
    defaultValues = preactClass.__defaults;

    if (!defaultValues) {
      defaultValues = defaults();
      preactClass.__defaults = defaultValues;
    }
  }

  const reassign = () => {
    for (const key in ret) {
      delete ret[key];
    }

    Object.assign(ret, defaultValues, props);
  };

  ctrl.beforeUpdate(reassign);
  reassign();

  return ret;
}

// --- setDefaults ---------------------------------------------------

function setDefaults<P extends Props, D extends Partial<P>>(
  props: P,
  defaults: D | (() => D)
): asserts props is P & D {
  const preactClass = (props as any)?.constructor?.__preactClass;

  if (typeof preactClass !== 'function') {
    throw new TypeError('Illegal first argument for function `setDefaults`');
  }

  let defaultValues: D | null = null;
  const ctrl = getCtrl();

  if (typeof defaults !== 'function') {
    defaultValues = defaults;
  } else {
    defaultValues = preactClass.__defaults;

    if (!defaultValues) {
      defaultValues = defaults();
      preactClass.__defaults = defaultValues;
    }
  }

  const updateProps = () => {
    for (const key in defaultValues) {
      if (!props.hasOwnProperty(key)) {
        (props as any)[key] = defaultValues[key];
      }
    }
  };

  updateProps();
  ctrl.beforeUpdate(updateProps);
}

// --- optimizeUpdates -----------------------------------------------

function optimizeUpdates(pred?: () => boolean): void {
  const ctrl = getCtrl();

  if (!pred) {
    ctrl.shouldUpdate((prevProps, nextProps) => {
      for (const key in prevProps) if (!(key in nextProps)) return true;

      for (const key in nextProps)
        if (prevProps[key] !== nextProps[key]) return true;

      return false;
    });
  } else {
    ctrl.shouldUpdate(() => pred!());
  }
}

// --- getRefresher --------------------------------------------------

function getRefresher(): (force?: boolean) => void {
  return getCtrl().getUpdater();
}

// --- stateVal ------------------------------------------------------

function stateVal<T>(value: T): [Getter<T>, Setter<T>] {
  const ctrl = getCtrl();
  const update = ctrl.getUpdater();
  let currVal: T = value;
  let nextVal: T = value;

  const getter = () => currVal;

  const setter: Setter<T> = (valueOrMapper): void => {
    nextVal =
      typeof valueOrMapper === 'function'
        ? (valueOrMapper as any)(nextVal)
        : valueOrMapper;

    update();
  };

  ctrl.beforeUpdate(() => void (currVal = nextVal));
  return [getter, setter];
}

function stateObj<T extends Record<string, any>>(
  values: T
): [T, StateObjSetter<T>] {
  const ctrl = getCtrl();
  const update = ctrl.getUpdater();
  const obj = { ...values };
  const clone = { ...values };

  let merge = false;

  ctrl.beforeUpdate(() => {
    if (merge) {
      Object.assign(obj, clone);

      merge = false;
    }
  });

  const setter: StateObjSetter<T> = ((updater: Updater<T, Partial<T>>) => {
    const values =
      typeof updater === 'function' ? (updater as any)(clone) : updater;

    Object.assign(clone, values);
    merge = true;
    update();
  }) as any;

  for (const key of Object.keys(obj)) {
    (setter as any)[key] = (updater: Updater<T>) => {
      (clone as any)[key] =
        typeof updater === 'function' ? (updater as any)(clone[key]) : updater;
      merge = true;
      update();
    };
  }

  return [obj, setter];
}

// --- stateFn -------------------------------------------------------

function stateFn<T>(initialValue: T): {
  (): T;
  (updater: Updater<T>): void;
} {
  let current = initialValue;
  let next = initialValue;
  const ctrl = getCtrl();
  const update = ctrl.getUpdater();

  ctrl.beforeUpdate(() => {
    current = next;
  });

  return function (updater?: Updater<T>) {
    if (arguments.length === 0) {
      return current;
    } else {
      next =
        typeof updater === 'function' ? (updater as any)(current) : updater;

      update();
    }
  } as any;
}

// --- stateRef ------------------------------------------------------

function stateRef<T>(initialValue: T): {
  current: T;
  set(value: T): void;
  map(mapper: (value: T) => T): void;
} {
  let current = initialValue;
  let next = initialValue;
  const ctrl = getCtrl();
  const update = ctrl.getUpdater();

  ctrl.beforeUpdate(() => {
    current = next;
  });

  return {
    get current() {
      return current;
    },

    set(value) {
      next = value;
      update();
    },

    map(mapper) {
      next = mapper(next);
      update();
    }
  };
}

// --- mutable -------------------------------------------------------

function mutable<T extends Record<string, any>>(initialState: T): T {
  const ret = {} as T;
  const values = { ...initialState };
  const update = getCtrl().getUpdater();

  for (const key of Object.keys(initialState)) {
    Object.defineProperty(ret, key, {
      get() {
        return values[key];
      },

      set(value: any) {
        (values as any)[key] = value;
        update();
      }
    });
  }

  return ret;
}

// --- createMemo ----------------------------------------------------

// TODO - this is not really optimized, is it?

function createMemo<T, A extends any[], G extends () => A>(
  getValue: (...args: ReturnType<G>) => T,
  getDeps: G
) {
  const ctrl = getCtrl();
  let oldDeps: any[], value: T;

  const memo = {
    get value() {
      const newDeps = getDeps();

      if (!oldDeps || !isEqualArray(oldDeps, newDeps)) {
        value = getValue.apply(null, newDeps as any); // TODO
      }

      oldDeps = newDeps;
      return value;
    }
  };

  return memo;
}

// --- effect --------------------------------------------------------

function effect(
  action: () => void | undefined | null | (() => void),
  getDeps?: null | (() => any[])
): void {
  const ctrl = getCtrl();

  let oldDeps: any[] | null = null,
    cleanup: Action | null | undefined | void;

  if (getDeps === null) {
    ctrl.afterMount(() => {
      cleanup = action();
    });
    ctrl.beforeUnmount(() => {
      cleanup && cleanup();
    });
  } else if (getDeps === undefined || typeof getDeps === 'function') {
    const callback = () => {
      let needsAction = getDeps === undefined;

      if (!needsAction) {
        const newDeps = getDeps!();

        needsAction =
          oldDeps === null ||
          newDeps === null ||
          !isEqualArray(oldDeps, newDeps);
        oldDeps = newDeps;
      }

      if (needsAction) {
        cleanup && cleanup();
        cleanup = action();
      }
    };

    ctrl.afterMount(callback);
    ctrl.afterUpdate(callback);
  } else {
    throw new TypeError(
      '[effect] Third argument must either be undefined, null or a function'
    );
  }
}

// --- consume -------------------------------------------------------

function consume<T>(context: Context<T>): () => T;

function consume<T extends Record<string, Context<any>>>(
  contexts: T
): { [K in keyof T]: ContextType<T[K]> };

function consume(ctx: any): any {
  const ctrl = getCtrl();

  if (ctx.Provider) {
    return ctrl.consumeContext(ctx);
  }

  const ret = {};

  for (const key of Object.keys(ctx)) {
    const get = ctrl.consumeContext(ctx[key]);

    Object.defineProperty(ctx, key, {
      get
    });
  }

  return ret;
}

// --- handleMethods -------------------------------------------------

function updateRef<T>(ref: Ref<T> | undefined, value: T | null): void {
  if (ref) {
    if (typeof ref === 'function') {
      ref(value);
    } else {
      ref.current = value;
    }
  }
}

function handleMethods<M extends Record<string, Function>>(
  getMethodsRef: () => RefObject<M> | undefined,
  methods: M
) {
  const ctrl = getCtrl();
  let ref: RefObject<M> | undefined = getMethodsRef();

  updateRef(ref, methods);

  ctrl.beforeUpdate(() => {
    const newRef = getMethodsRef();

    if (newRef !== ref) {
      updateRef(ref, null);
      ref = newRef;
      updateRef(ref, methods);
    }
  });

  ctrl.beforeUnmount(() => {
    updateRef(ref, null);
  });
}

// --- interval ------------------------------------------------------

function interval(
  callbackOrRef: (() => void) | { current: () => void },
  delayOrGetDelay: number | (() => number)
) {
  const getCallback =
    typeof callbackOrRef === 'function'
      ? () => callbackOrRef
      : () => callbackOrRef.current;

  const getDelay =
    typeof delayOrGetDelay === 'function'
      ? delayOrGetDelay
      : () => delayOrGetDelay;

  effect(
    () => {
      const id = setInterval(getCallback(), getDelay());

      return () => clearInterval(id);
    },
    () => [getCallback(), getDelay()]
  );
}

// --- handlePromise ---------------------------------------------------

type PromiseRes<T> =
  | {
      result: null;
      error: null;
      state: 'pending';
    }
  | {
      result: T;
      error: null;
      state: 'resolved';
    }
  | {
      result: null;
      error: Error;
      state: 'rejected';
    };

const initialState: PromiseRes<any> = {
  result: null,
  error: null,
  state: 'pending'
};

function handlePromise<T>(
  getPromise: () => Promise<T>,
  getDeps?: () => any[]
): PromiseRes<T> {
  const ctrl = getCtrl();
  const [getState, setState] = stateVal<PromiseRes<T>>(initialState);

  let promiseIdx = -1;

  effect(
    () => {
      ++promiseIdx;

      if (getState().state !== 'pending') {
        setState(initialState);
      }

      const myPromiseIdx = promiseIdx;

      getPromise()
        .then((result) => {
          if (promiseIdx === myPromiseIdx) {
            setState({
              result,
              error: null,
              state: 'resolved'
            });
          }
        })
        .catch((error) => {
          if (promiseIdx === myPromiseIdx) {
            setState({
              result: null,
              error: error instanceof Error ? error : new Error(String(error)),
              state: 'rejected'
            });
          }
        });
    },
    typeof getDeps === 'function' ? getDeps : null
  );

  return getState();
}

// --- ticker --------------------------------------------------------

function createTicker(): () => Date;
function createTicker<T>(mapper: (time: Date) => T): () => T;

function createTicker(mapper?: (time: Date) => any): any {
  const now = () => new Date();
  const [getTime, setTime] = stateVal(now());

  interval(() => {
    setTime(now());
  }, 1000);

  return mapper ? () => mapper(getTime()) : getTime();
}

// === create ========================================================

type ControllerClass<T, A extends any[]> = {
  new (host: ReactiveControllerHost, ...args: A): T;
};

function create<C extends ControllerClass<any, A>, A extends any[]>(
  controllerClass: C,
  ...args: A
): InstanceType<C> {
  const ctrl = getCtrl();
  const host = new Host(ctrl);

  return new controllerClass(host, ...args);
}

class Host implements ReactiveControllerHost {
  #update: () => void;
  #controllers = new Set<ReactiveController>();

  constructor(ctrl: ComponentCtrl) {
    this.#update = ctrl.getUpdater();

    ctrl.afterMount(() => {
      this.#controllers.forEach((it) => it.hostConnected && it.hostConnected());
    });

    ctrl.beforeUnmount(() => {
      this.#controllers.forEach(
        (it) => it.hostDisconnected && it.hostDisconnected()
      );
    });

    ctrl.beforeUpdate(() => {
      this.#controllers.forEach((it) => it.hostUpdate && it.hostUpdate());
    });

    ctrl.afterUpdate(() => {
      this.#controllers.forEach((it) => it.hostUpdated && it.hostUpdated());
    });
  }

  addController(controller: ReactiveController) {
    this.#controllers.add(controller);
  }

  removeController(controller: ReactiveController) {
    this.#controllers.delete(controller);
  }

  requestUpdate(): void {
    this.#update();
  }

  get updateComplete() {
    return Promise.resolve(true); // TODO!!!
  }
}

// --- locals --------------------------------------------------------

function isEqualArray(arr1: any[], arr2: any[]) {
  let ret =
    Array.isArray(arr1) && Array.isArray(arr2) && arr1.length === arr2.length;

  if (ret) {
    for (let i = 0; i < arr1.length; ++i) {
      if (arr1[i] !== arr2[i]) {
        ret = false;
        break;
      }
    }
  }

  return ret;
}
