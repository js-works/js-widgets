import { ReactiveControllerHost } from 'lit';
import { makeAutoObservable } from 'mobx';
import { createContext, RefObject } from 'js-widgets';
import { createRefFor } from 'js-widgets/util';
import { makeComponentsMobxAware } from 'js-widgets/mobx-tools';
import { useEffect, useState } from 'js-widgets/hooks';
import { opt, props, widget } from 'js-widgets';

import {
  atom,
  consume,
  create,
  createMemo,
  createTicker,
  effect,
  getRefresher,
  state,
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
export const simpleCounterDemo3 = () => <SimpleCounterDemo3 />;
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

function SimpleCounterDemo(p: {
  initialCount?: number; //
  label?: string;
}) {
  preset(p, () => ({
    initialCount: 0,
    label: 'Counter'
  }));

  const [getCount, setCount] = atom(p.initialCount);
  const onIncrement = () => setCount((it) => it + 1);
  const onInput = (ev: any) => setCount(ev.currentTarget.valueAsNumber); // TODO

  effect(
    () => {
      console.log(`Value of "${p.label}": ${getCount()}`);
    },
    () => [getCount()]
  );

  return () => (
    <div>
      <h3>Simple counter demo:</h3>
      <label>{p.label}: </label>
      <input type="number" value={getCount()} onInput={onInput} />
      <button onClick={onIncrement}>{getCount()}</button>
    </div>
  );
}

// === Simple counter demo 2 =========================================

function SimpleCounterDemo2({
  initialCount = 0, //
  label = 'Counter'
}) {
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
}

// === Simple counter demo 3 =========================================

const SimpleCounterDemo3 = widget('SimpleCounterDemo3')(
  props({
    initialCount: opt(0),
    label: opt('Counter')
  })
)((p) => {
  const [s, set] = state({ count: p.initialCount });
  const onIncrement = () => set.count((it) => it + 1);

  return () => (
    <div>
      <h3>Simple counter demo 3:</h3>
      <button onClick={onIncrement}>
        {p.label}: {s.count}{' '}
      </button>
    </div>
  );
});

// === Complex counter demo ==========================================

function ComplexCounter(p: {
  initialCount?: number;
  label?: string;

  ref?: RefObject<{
    reset(n: number): void;
  }>;
}) {
  preset(p, () => ({
    initialCount: 0,
    label: 'Counter'
  }));

  const [getCount, setCount] = atom(p.initialCount);
  const onIncrement = () => setCount((it) => it + 1);
  const onDecrement = () => setCount((it) => it - 1);

  handleMethods(() => p.ref, {
    reset(n) {
      setCount(n);
    }
  });

  return () => (
    <div>
      <h3>Complex counter demo:</h3>
      <label>{p.label}: </label>
      <button onClick={onDecrement}>-</button>
      {` ${getCount()} `}
      <button onClick={onIncrement}>+</button>
    </div>
  );
}

function ComplexCounterDemo() {
  const counterRef = createRefFor(ComplexCounter);
  const onResetToZeroClick = () => counterRef.current!.reset(0);
  const onResetToOneHundredClick = () => counterRef.current!.reset(100);

  return () => (
    <div>
      <ComplexCounter ref={counterRef} />
      <br />
      <button onClick={onResetToZeroClick}>Reset to 0</button>
      <button onClick={onResetToOneHundredClick}>Reset to 100</button>
    </div>
  );
}

// === Clock demo ====================================================

function ClockDemo() {
  const getTime = createTicker((it) => it.toLocaleTimeString());

  return () => (
    <div>
      <h3>Clock demo:</h3>
      Current time: {getTime()}
    </div>
  );
}

// === Memo demo =====================================================

function MemoDemo() {
  const [s, set] = state({ count: 0 });
  const onButtonClick = () => set.count((it) => it + 1);
  const memo = createMemo(
    () =>
      'Last time the memoized value was calculated: ' +
      new Date().toLocaleTimeString(),
    () => [Math.floor(s.count / 5)]
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
}

// === Interval demo =================================================

function IntervalDemo() {
  const [s, set] = state({
    count: 0,
    delay: 1000
  });

  const onReset = () => set.delay(1000);

  interval(
    () => set.count((it) => it + 1),
    () => s.delay
  );

  interval(() => {
    if (s.delay > 10) {
      set.delay((it) => (it /= 2));
    }
  }, 1000);

  return () => (
    <div>
      <h3>Interval demo:</h3>
      <div>Counter: {s.count}</div>
      <div>Delay: {s.delay}</div>
      <br />
      <button onClick={onReset}>Reset delay</button>
    </div>
  );
}

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

const [localeCtx, LocaleProvider] = createContext('locale', 'en');

function ContextDemo() {
  const [getLocale, setLocale] = atom('en');
  const onLocaleChange = (ev: any) => setLocale(ev.target.value);

  return () => (
    <LocaleProvider value={getLocale()}>
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
    </LocaleProvider>
  );
}

function LocaleText(p: { id: string }) {
  const getLocale = consume(localeCtx);

  return () => (
    <p>
      {(translations as any)[getLocale()][p.id]} {/* // TODO */}
    </p>
  );
}

// === mouse position demo / ReactiveController demo =================

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

function MousePositionDemo() {
  const mousePos = create(MousePosController);

  return () => (
    <div>
      {mousePos.valid()
        ? `Mouse position: ${mousePos.x()}x${mousePos.y()}`
        : 'Please move mouse ...'}
    </div>
  );
}

// === promise demo ==================================================

function Loader(p: { loadingText?: string; finishText?: string }) {
  const res = handlePromise(() => wait(4000));

  return () =>
    res.state === 'pending' ? (
      <div>{p.loadingText}</div>
    ) : (
      <div>{p.finishText}</div>
    );
}

function PromiseDemo() {
  const [s, set] = state({
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
          key={s.key}
          loadingText={s.loadingText}
          finishText={s.finishText}
        />
      </section>
      <br />
      <button onClick={onRefresh}>Refresh</button>
      <button onClick={onRestart}>Restart</button>
      <button onClick={onToggleLoadingText}>Toggle loading text</button>
      <button onClick={onToggleFinishText}>Toggle finish text</button>
    </div>
  );
}

function MobxCounterInfo1() {
  return (
    <div>
      <h3>Mobx counter info 1</h3>
      Count: {store.count}
    </div>
  );
}

function MobxCounterInfo2() {
  return (
    <div>
      <h3>Mobx counter info 2</h3>
      Count: {store.count}
    </div>
  );
}

function MobxDemo() {
  return (
    <div>
      <MobxCounterInfo1 />
      <MobxCounterInfo2 />
    </div>
  );
}

// === utils =========================================================

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(() => resolve(), ms));
}
