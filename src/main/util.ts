// === exports =======================================================

export { createRef };

// === exported functions ============================================

function createRef<T>(): { current: T };
function createRef<T>(value: T): { current: T | null };

function createRef(value?: any): { current: any } {
  return {
    current: arguments.length === 0 ? null : value
  };
}
