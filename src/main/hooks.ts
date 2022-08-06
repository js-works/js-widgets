import { intercept, ComponentCtrl, ComponentCtrlGetter } from 'js-widgets';

// === exports =======================================================

export { useEffect, useRef, useState };

// === local types ===================================================

type Ref<T> = { current: T };
type StateUpdater<T> = (value: T) => T;
type StateSetter<T> = (updater: StateUpdater<T>) => void;

// === local data ====================================================

let currComponentId: string | null = null;
let currComponentCtrlGetter: ComponentCtrlGetter | null;

const hookData: Record<
  string,
  {
    hookIndex: number;
    values: any[];
  }
> = {};

// === interception logic ============================================

intercept({
  onRender(next, id, getCtrl) {
    try {
      currComponentId = id;
      currComponentCtrlGetter = getCtrl;
      next();
    } finally {
      currComponentId = null;
      currComponentCtrlGetter = null;
    }
  }
});

// === local functions ===============================================

function createRef<T>(value: T) {
  return { current: value };
}

function hook<T>(
  action: (
    ctrl: ComponentCtrl | null,
    prevValue: T | undefined,
    isInitialized: boolean
  ) => T
): T {
  if (!currComponentId) {
    throw new Error(
      'Hook function has been called outside of component function'
    );
  }

  const componentId = currComponentId;
  let rec = hookData[componentId];
  let ctrl = currComponentCtrlGetter ? currComponentCtrlGetter(1) : null;

  if (!rec) {
    if (!currComponentCtrlGetter) {
      throw new Error(
        'Hook function has been called outside of component function'
      );
    }

    rec = { hookIndex: -1, values: [] };
    hookData[componentId] = rec;

    const resetHookIndex = () => void (rec!.hookIndex = -1);

    ctrl!.afterMount(resetHookIndex);
    ctrl!.afterUpdate(resetHookIndex);
  }

  const isInitialized = ++rec.hookIndex < rec.values.length;
  const nextValue = action(ctrl, rec.values[rec.hookIndex], isInitialized);
  rec.values[rec.hookIndex] = nextValue;

  return nextValue;
}

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

// === public hook functions =========================================

function useRef<T>(value: T): Ref<T>;
function useRef<T>(): Ref<T | null>;

function useRef(value?: any): Ref<any> {
  return hook<Ref<any>>((_, prevValue) => prevValue || createRef(value));
}

function useState<T>(
  value: T
): [value: T, setter: (updater: StateUpdater<T>) => void] {
  const data = hook<[T, StateSetter<T>, () => void]>(
    (ctrl, data, initialized) => {
      let refresh = data && data[2];

      if (!initialized) {
        const updaters: StateUpdater<T>[] = [];
        refresh = ctrl!.getUpdater();

        data = [
          value,
          (updater) => {
            updaters.push(updater);
            refresh!();
          },
          refresh
        ];

        ctrl!.beforeUpdate(() => {
          try {
            updaters.forEach((updater) => (data![0] = updater(data![0])));
          } finally {
            updaters.length = 0;
          }
        });
      }

      return data!;
    }
  );

  return [data[0], data[1]];
}

function useEffect<T extends any[]>(
  action: () => void,
  deps: T | null = null
): void {
  const actionRef = useRef(action);
  const prevDepsRef = useRef<T>();
  const currDepsRef = useRef<T>();

  hook((ctrl, _, initialized) => {
    actionRef.current = action;
    prevDepsRef.current = currDepsRef.current;
    currDepsRef.current = deps;

    if (!initialized) {
      const task = () => {
        const currDeps = currDepsRef.current;
        const prevDeps = prevDepsRef.current;

        if (!currDeps || !prevDeps || !isEqualArray(currDeps, prevDeps)) {
          actionRef.current();
        }
      };

      ctrl!.afterMount(task);
      ctrl!.afterUpdate(task);
    }
  });
}
