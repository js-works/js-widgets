# js-widgets

A R&D project to evaluate an API for developing components using an alternative to hook functions (called "extensions"), while still remain the possibility to implement in usual react-style.
<br />
The main advantages of the new API (= using "extensions" instead of "hooks") are:

- No rules of hooks
- No special linter necessary

Be aware that this project is just for research purposes and is not meant to be used in production.

### Installation

```
git clone https://github.com/js-works/js-widgets.git
cd js-widgets
npm install
```

### Running demos

```
npm run storybook
```

## Examples

Remark: We are using the following naming convention to
reduce the amount of noise in the source code (for non-trivial
components, where you access the props and the state object
very often, that makes quite a difference):

- `p` is the variable for the props object
- `s` is the variable for a state object

### Simple counter

```tsx
import { render } from 'js-widgets';
import { preset, state } from 'js-widgets/ext';

function Counter(p: {
  name?: string; //
  initialCount?: number;
}) {
  preset(p, {
    initialCount: 0,
    name: 'Counter'
  });

  const [s, set] = state({ count: p.initialCount });
  const increment = () => set.count((it) => it + 1);

  return () => (
    <button onClick={increment}>
      {p.name}: {s.count}
    </button>
  );
}

render(<Counter />, '#app');
```

### Additional example - showing some lifecycle extensions

```tsx
import { render } from 'js-widgets';
import { afterMount, effect, preset, state } from 'js-widgets/ext';

function Counter(p: {
  name?: string; //
  initialCount?: number;
}) {
  preset(p, {
    name: 'Counter',
    initialCount: 0
  });

  const [s, set] = state({ count: p.initialCount });
  const increment = () => set.count((it) => it + 1);

  afterMount(() => {
    console.log(`Counter "${p.name}" has been mounted`);
    return () => console.log(`Counter "${p.name}" will unmount`);
  });

  effect(
    () => console.log(`Value of "${p.name}": ${s.count}`),
    () => [s.count]
  );

  return () => (
    <div>
      <button onClick={increment}>
        {p.name}: {s.count}
      </button>
    </div>
  );
}

render(<Counter />, '#app');
```

## API

### Core functions

- createContext
- createElement
- createPortal
- getType
- getProps
- intercept
- isElement
- lazy
- render
- Boundary
- Fragment
- Suspense

### Extensions

tbd

### Hooks

tbd

### Utility functions

tbd

## Project state

This R&D project is in a very early development state
