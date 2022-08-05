// === exports =======================================================

export { createRef };

// === exported functions ============================================

function createRef<T>(): { current: T | null };
function createRef<T>(value: T): { current: T };

function createRef(value?: any): { current: any } {
  return {
    current: arguments.length === 0 ? null : value
  };
}
