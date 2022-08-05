# js-widgets

A R&D project to evaluate an API for developing components using an alternative to hook functions (called "extensions"), while still remain the possibility to implement in usual react-style.
<br />
The main advantages of the new API are:

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

### Simple counter

```tsx
import { render } from 'js-widgets';
import { preset, stateObj } from 'js-widgets/ext';

function Counter(props: {
  name?: string; //
  initialCount?: number;
}) {
  const p = preset(props, () => ({
    initialCount: 0,
    label: 'Counter'
  }));

  const [s, set] = stateObj({ count: p.initialCount });
  const onIncrement = () => set.count((it) => it + 1);

  return () => (
    <button onClick={onIncrement}>
      {p.name}: {s.count}
    </button>
  );
}

render(<Counter />, '#app');
```

### Additional example - showing some more features

```tsx
import { render } from 'js-widgets';
import { effect, preset, stateObj } from 'js-widgets/ext';

function Counter(props: {
  initialCount?: number;
  label?: string;
}) {
  const p = preset(props, () => ({
    initialCount: 0,
    label: 'Counter'
  }));

  const [s, set] = stateObj({
    count: props.initialCount
  });

  const onIncrement = () => set.count((it) => it + 1);

  effect(
    () => console.log(`Value of "${p.label}": ${s.count}`),
    () => [s.count]
  );

  return () => (
    <div>
      <button onClick={onIncrement}>
        {p.name}: {s.count}
      </button>
    </div>
  );
});

render(<Counter />, '#app');
```

## API

### Core functions

tbd

### Extensions

tbd

### Hooks

tbd

### Utility functions

tbd

## Project state

This R&D project is in a very early development state
