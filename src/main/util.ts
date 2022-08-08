import { Component, RefObject } from 'js-widgets';

// === exports =======================================================

export { classes, createRef, createRefFor };

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
