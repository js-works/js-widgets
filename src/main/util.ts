import type { Component, Props, RefObject } from 'js-widgets';

// === exports =======================================================

export { classes, component, createRef, createRefFor, setName };

// === local data ====================================================

const hasOwn = {}.hasOwnProperty;

// === exported functions ============================================

function createRef<T>(value?: T): { current: T | null } {
  return {
    current: arguments.length === 0 ? null : value!
  };
}

function createRefFor<T extends object>(
  component: Component<{ ref: RefObject<T> }>
): RefObject<T> {
  return createRef();
}

function classes(
  ...args: (
    | undefined
    | null
    | false
    | string
    | (undefined | null | false | string)[]
    | Record<string, boolean>
  )[]
): string {
  const arr: string[] = [];

  for (const arg of args) {
    if (arg) {
      if (typeof arg === 'string') {
        arr.push(arg);
      } else if (Array.isArray(arg)) {
        for (const s of arg) {
          if (s) {
            arr.push(s);
          }
        }
      } else {
        for (const key in arg) {
          if (hasOwn.call(arg, key) && (arg as any)[key]) {
            arr.push(key);
          }
        }
      }
    }
  }

  return arr.join(' ');
}

function setName(func: Function, name: string) {
  Object.defineProperty(func, name, {
    value: name
  });
}

function component<P extends Props>(main: Component<P>): Component<P>;

function component<P extends Props>(
  name: string,
  main: Component<P>
): Component<P>;

function component(
  name: string
): <P extends Props>(main: Component<P>) => Component<P>;

function component<P extends Props>(
  main: Component<P>
): <D extends Partial<P>>(
  defaults: D
) => (main: (props: P & D) => () => JSX.Element) => Component<P>;

function component(arg1: any, arg2?: any): any {
  if (typeof arg1 === 'function') {
    return component('', arg1);
  } else if (arguments.length < 2) {
    return (arg3: any) => {
      if (typeof arg3 === 'function') {
        return component(arg1, arg3);
      } else {
        return (arg4: any) =>
          component(arg1, (props) => {
            const defaults = arg3;
            (props.constructor as any).__defaults = defaults;

            for (const key of Object.keys(defaults)) {
              if (props[key] === undefined) {
                props[key] = defaults[key];
              }
            }

            return arg4(props);
          });
      }
    };
  }

  const ret = arg2.bind(null);
  setName(ret, arg1);
  return ret;
}
