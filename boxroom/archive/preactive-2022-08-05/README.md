# preactive

A R&D project to evaluate an alternative API for developing components
with Preact using an alternative to hook functions (called "extensions").<br>
The main advantages of the new API are:

- No rules of hooks
- No special linter necessary
- 100% accurately typeable

Be aware that this project is just for research purposes and
is not meant to be used in production.

### Installation

```
git clone https://github.com/js-works/preactive.git
cd preactive
npm install
```

### Running demos

```
npm run storybook
```

## Examples

### Simple counter

```tsx
import { h, render } from 'preact';
import { component, preset } from 'preactive';
import { stateVal } from 'preactive/ext';

const Counter = component('Counter')<{
  initialCount?: number;
  label?: string;
}>((props) => {
  preset(props, () => ({
    initialCount: 0,
    label: 'Counter'
  }));

  const [getCount, setCount] = stateVal(props.initialCount);
  const onIncrement = () => setCount((it) => it + 1);

  return () => (
    <div>
      <label>{props.label}: </label>
      <button onClick={onIncrement}>{getCount()}</button>
    </div>
  );
});

render(<Counter />, document.getElementById('app'));
```

### Additional example - showing some more features

```tsx
import { h, render } from 'preact';
import { component, preset } from 'preactive';
import { effect, stateObj } from 'preactive/ext';

const Counter = component('Counter')<{
  initialCount?: number;
  label?: string;
}>((props) => {
  preset(props, () => ({
    initialCount: 0,
    label: 'Counter'
  }));

  const [state, set] = stateObj({
    count: props.initialCount
  });

  const onIncrement = () => set.count((it) => it + 1);

  effect(
    () => console.log(`Value of "${props.label}": ${state.count}`),
    () => [state.count]
  );

  return () => (
    <div>
      <label>{props.label}: </label>
      <button onClick={onIncrement}>{state.count}</button>
    </div>
  );
});

render(<Counter />, document.getElementById('app'));
```

## API

### Core functions

- `component(displayName, render: props => vnode): ComponentClass`
- `component(displayName, init: props => () => vnode): ComponentClass`
- `component(displayName): (render: props => vnode) => ComponentClass`
- `component(displayName): (init: props => () => vnode) => ComponentClass`
- `preset(props, defaultProps or getDefaultProps)`

### Utility functions

- tbd

### Extensions

- `stateVal(initialValue)`
- `stateObj(initialValues)`
- `createMemo(calculation, getDependencies)`
- `consume(context)`
- `effect(action, getDependencies? | null)`
- `interval(action, milliseconds)`
- `handlePromise(getPromise)`

## Project state

This R&D project is in a very early development state
