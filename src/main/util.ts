import { Component, RefObject } from 'js-widgets';

// === exports =======================================================

export { createRef, createRefFor };

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
