/** @jsx h */
import { ReactiveControllerHost } from 'lit';
import { makeAutoObservable } from 'mobx';
import { makeComponentsMobxAware } from 'preactive/mobx-tools';
import { h, createContext, createRef, RefObject } from 'preact';
import { component, PropsOf } from 'preactive';
import { useEffect, useState } from 'preactive/hooks';

import {
  consume,
  create,
  createMemo,
  createTicker,
  effect,
  getRefresher,
  stateVal,
  stateObj,
  interval,
  handleMethods,
  handlePromise,
  preset
} from '../main/ext';

export default {
  title: 'Demos'
};

export const simpleCounterDemo = () => <SimpleCounterDemo />;
export const simpleCounterDemo2 = () => <SimpleCounterDemo2 />;
export const complexCounterDemo = () => <ComplexCounterDemo />;
export const clockDemo = () => <ClockDemo />;
export const memoDemo = () => <MemoDemo />;
export const intervalDemo = () => <IntervalDemo />;
export const contextDemo = () => <ContextDemo />;
export const mousePositionDemo = () => <MousePositionDemo />;
export const promiseDemo = () => <PromiseDemo />;
export const mobxDemo = () => <MobxDemo />;

// Auto-updating mobx store

const store = makeAutoObservable({
  count: 0,

  increment() {
    this.count++;
  }
});

makeComponentsMobxAware();
setInterval(() => store.increment(), 1000);

// === Simple counter demo ===========================================

const SimpleCounterDemo = component('SimpleCounterDemo')<{
  initialCount?: number;
  label?: string;
}>((p) => {
  const props = preset(p, () => ({
    initialCount: 0,
    label: 'Counter'
  }));

  const [getCount, setCount] = stateVal(props.initialCount);
  const onIncrement = () => setCount((it) => it + 1);
  const onInput = (ev: any) => setCount(ev.currentTarget.valueAsNumber); // TODO

  effect(
    () => {
      console.log(`Value of "${props.label}": ${getCount()}`);
    },
    () => [getCount()]
  );

  return () => (
    <div>
      <h3>Simple counter demo:</h3>
      <label>{props.label}: </label>
      <input type="number" value={getCount()} onInput={onInput} />
      <button onClick={onIncrement}>{getCount()}</button>
    </div>
  );
});

// === Simple counter demo 2 =========================================

const SimpleCounterDemo2 = component('SimpleCounterDemo2')<{
  initialCount?: number;
  label?: string;
}>(({ initialCount = 0, label = 'Counter' }) => {
  const [count, setCount] = useState(initialCount);
  const onIncrement = () => setCount((it) => it + 1);

  useEffect(() => {
    console.log(`Value of "${label}": ${count}`);
  }, [label, count]);

  return (
    <div>
      <h3>Simple counter demo 2:</h3>
      <button onClick={onIncrement}>
        {label}: {count}
      </button>
    </div>
  );
});

// === Complex counter demo ==========================================

const ComplexCounter = component('ComplexCounter')<{
  initialCount?: number;
  label?: string;

  componentRef?: RefObject<{
    reset(n: number): void;
  }>;
}>((p) => {
  const props = preset(p, {
    initialCount: 0,
    label: 'Counter'
  });

  const [getCount, setCount] = stateVal(props.initialCount);
  const onIncrement = () => setCount((it) => it + 1);
  const onDecrement = () => setCount((it) => it - 1);

  handleMethods(() => props.componentRef, {
    reset(n) {
      setCount(n);
    }
  });

  return () => (
    <div>
      <h3>Complex counter demo:</h3>
      <label>{props.label}: </label>
      <button onClick={onDecrement}>-</button>
      {` ${getCount()} `}
      <button onClick={onIncrement}>+</button>
    </div>
  );
});

const ComplexCounterDemo = component('ComplexCounterDemo', () => {
  const counterRef: any =
    createRef<PropsOf<typeof ComplexCounter>['componentRef']>(); // TODO

  const onResetToZeroClick = () => counterRef.current.reset(0);
  const onResetToOneHundredClick = () => counterRef.current.reset(100);

  return () => (
    <div>
      <ComplexCounter componentRef={counterRef} />
      <br />
      <button onClick={onResetToZeroClick}>Reset to 0</button>
      <button onClick={onResetToOneHundredClick}>Reset to 100</button>
    </div>
  );
});

// === Clock demo ====================================================

const ClockDemo = component('ClockDemo', () => {
  const getTime = createTicker((it) => it.toLocaleTimeString());

  return () => (
    <div>
      <h3>Clock demo:</h3>
      Current time: {getTime()}
    </div>
  );
});

// === Memo demo =====================================================

const MemoDemo = component('MemoDemo', () => {
  const [state, set] = stateObj({ count: 0 });
  const onButtonClick = () => set.count((it) => it + 1);
  const memo = createMemo(
    () =>
      'Last time the memoized value was calculated: ' +
      new Date().toLocaleTimeString(),
    () => [Math.floor(state.count / 5)]
  );

  return () => (
    <div>
      <h3>Memoization demo:</h3>
      <button onClick={onButtonClick}>
        Every time you've clicked this button 5 times
        <br />
        the memoized calculation will be performed again
      </button>
      <p>{memo.value}</p>
    </div>
  );
});

// === Interval demo =================================================

const IntervalDemo = component('IntervalDemo', () => {
  const [state, set] = stateObj({
    count: 0,
    delay: 1000
  });

  const onReset = () => set.delay(1000);

  interval(
    () => set.count((it) => it + 1),
    () => state.delay
  );

  interval(() => {
    if (state.delay > 10) {
      set.delay((it) => (it /= 2));
    }
  }, 1000);

  return () => (
    <div>
      <h3>Interval demo:</h3>
      <div>Counter: {state.count}</div>
      <div>Delay: {state.delay}</div>
      <br />
      <button onClick={onReset}>Reset delay</button>
    </div>
  );
});

// === Context demo ==================================================

const translations = {
  en: {
    salutation: 'Hello, ladies and gentlemen!'
  },
  de: {
    salutation: 'Hallo, meine Damen und Herren!'
  },
  fr: {
    salutation: 'Salut, Mesdames, Messieurs!'
  }
};

const LocaleCtx = createContext('en');

const ContextDemo = component('ContextDemo', () => {
  const [getLocale, setLocale] = stateVal('en');
  const onLocaleChange = (ev: any) => setLocale(ev.target.value);

  return () => (
    <LocaleCtx.Provider value={getLocale()}>
      <h3>Context demo:</h3>
      <div>
        <label htmlFor="lang-selector">Select language: </label>
        <select
          id="lang-selector"
          value={getLocale()}
          onChange={onLocaleChange}
        >
          <option value="en">en</option>
          <option value="fr">fr</option>
          <option value="de">de</option>
        </select>
        <LocaleText id="salutation" />
      </div>
    </LocaleCtx.Provider>
  );
});

const LocaleText = component<{
  id: string;
}>('LocaleText', (props) => {
  const getLocale = consume(LocaleCtx);

  return () => (
    <p>
      {(translations as any)[getLocale()][props.id]} {/* // TODO */}
    </p>
  );
});

// === mouse position demo / ReactiveContoller demo ==================

class MousePosController {
  #valid = false;
  #x = -1;
  #y = -1;

  constructor(host: ReactiveControllerHost) {
    const mouseMoveListener = (ev: MouseEvent) => {
      this.#valid = true;
      this.#x = ev.clientX;
      this.#y = ev.clientY;
      host.requestUpdate();
    };

    host.addController({
      hostConnected() {
        window.addEventListener('mousemove', mouseMoveListener);
      },

      hostDisconnected() {
        window.removeEventListener('mousemove', mouseMoveListener);
      }
    });
  }

  valid() {
    return this.#valid;
  }

  x() {
    return this.#x;
  }

  y() {
    return this.#y;
  }
}

const MousePositionDemo = component('MousePositionDemo', () => {
  const mousePos = create(MousePosController);

  return () => (
    <div>
      {mousePos.valid()
        ? `Mouse position: ${mousePos.x()}x${mousePos.y()}`
        : 'Please move mouse ...'}
    </div>
  );
});

// === promise demo ==================================================

const Loader = component('Loader')<{
  loadingText?: string;
  finishText?: string;
}>((props) => {
  const res = handlePromise(() => wait(4000));

  return () =>
    res.state === 'pending' ? (
      <div>{props.loadingText}</div>
    ) : (
      <div>{props.finishText}</div>
    );
});

const PromiseDemo = component('PromiseDemo', () => {
  const [state, set] = stateObj({
    key: 0,
    loadingText: 'Loading...',
    finishText: 'Finished!'
  });

  const refresh = getRefresher();
  const onRefresh = () => refresh();
  const onRestart = () => set.key((it) => it + 1); // TODO

  const onToggleLoadingText = () =>
    set.loadingText((it) =>
      it === 'Loading...' ? 'Please wait...' : 'Loading...'
    );

  const onToggleFinishText = () =>
    set.finishText((it) => (it === 'Finished!' ? 'Done!' : 'Finished!'));

  return () => (
    <div>
      <h3>Promise demo (last update {new Date().toLocaleTimeString()})</h3>
      <section>
        <Loader
          key={state.key}
          loadingText={state.loadingText}
          finishText={state.finishText}
        />
      </section>
      <br />
      <button onClick={onRefresh}>Refresh</button>
      <button onClick={onRestart}>Restart</button>
      <button onClick={onToggleLoadingText}>Toggle loading text</button>
      <button onClick={onToggleFinishText}>Toggle finish text</button>
    </div>
  );
});

const MobxCounterInfo1 = component('MobxCounterInfo1', () => {
  return (
    <div>
      <h3>Mobx counter info 1</h3>
      Count: {store.count}
    </div>
  );
});

const MobxCounterInfo2 = component('MobxCounterInfo2', () => {
  return (
    <div>
      <h3>Mobx counter info 2</h3>
      Count: {store.count}
    </div>
  );
});

const MobxDemo = component('MobxDemo', () => {
  return (
    <div>
      <MobxCounterInfo1 />
      <MobxCounterInfo2 />
    </div>
  );
});

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(() => resolve(), ms));
}
