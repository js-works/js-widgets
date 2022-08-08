import { options, ComponentClass } from 'preact';

import {
  createContext as createPreactContext,
  createElement as preactCreateElement,
  createPortal,
  lazy,
  render as preactRender,
  Component as PreactComponent,
  Fragment,
  JSX,
  Suspense
} from 'preact/compat';

import type { VNode } from 'preact';

// === exports =======================================================

export {
  createContext,
  createElement,
  createPortal,
  getType,
  getProps,
  intercept,
  lazy,
  render,
  Boundary,
  Fragment,
  Suspense
};

export type {
  Component,
  ComponentCtrl,
  ComponentCtrlGetter,
  Context,
  Props,
  PropsOf,
  RefObject,
  VNode
};

// === global types ==================================================

declare global {
  namespace JSX {
    interface IntrinsicElements extends preact.JSX.IntrinsicElements {}
    interface IntrinsicAttributes extends preact.JSX.IntrinsicAttributes {}

    type Element = any; // TODO!!!!!!!!!!!!!!!!!!!
  }
}

// === exported types ================================================

interface Props extends Record<string, any> {}

interface Component<P extends Props = Props> {
  (p: P): JSX.Element | any | (() => JSX.Element);
}

interface ComponentCtrl {
  afterMount(task: () => void): void;
  beforeUpdate(task: () => void): void;
  afterUpdate(task: () => void): void;
  beforeUnmount(task: () => void): void;
  shouldUpdate(pred: (prevProps: Props, nextProps: Props) => boolean): void;
  getUpdater: () => (force?: boolean) => void;
  consumeContext<T>(ctx: Context<T>): () => T;
}

type ComponentCtrlGetter = (intention: 0 | 1 | 2) => ComponentCtrl;
type PropsOf<T extends Component> = T extends Component<infer P> ? P : never;
type RefObject<T> = { current: T | null };

type Context<T> = {
  contextName: string;
  defaultValue: T;
};

// === local types ===================================================

type Task = () => void;

type LifecycleEvent =
  | 'afterMount'
  | 'beforeUpdate'
  | 'afterUpdate'
  | 'beforeUnmount';

type LifecycleEventHandler = (event: LifecycleEvent) => void;

// ===  constants ====================================================

// Brrrr, this is horrible as hell - but what shall we do?
const isMinimized = PreactComponent.name !== 'Component';
const keyContextId = isMinimized ? '__c' : '_id';
const keyContextDefaultValue = isMinimized ? '__' : '_defaultValue';

// === local data ====================================================

let onCreateElement:
  | ((next: () => void, type: string | Function, props: Props) => void)
  | null = null;

let onInit: (
  next: () => void, //
  componentId: string,
  getCtrl: ComponentCtrlGetter
) => void = (next) => next();

let onRender: (
  next: () => void,
  componentId: string,
  getCtrl: ComponentCtrlGetter | null
) => void = (next) => next();

// === local classes and functions ===================================

class Controller implements ComponentCtrl {
  preactComponent: BaseComponent<any>;

  #lifecycle: Record<LifecycleEvent, Task[]> = {
    afterMount: [],
    beforeUpdate: [],
    afterUpdate: [],
    beforeUnmount: []
  };

  #update: (force?: boolean) => void;

  constructor(
    component: BaseComponent<Props & unknown>,
    update: (force?: boolean) => void,
    setLifecycleEventHandler: (handler: LifecycleEventHandler) => void
  ) {
    this.preactComponent = component;
    this.#update = update;

    setLifecycleEventHandler((eventName) => {
      this.#lifecycle[eventName].forEach((it) => it());
    });
  }

  afterMount(task: Task) {
    this.#lifecycle.afterMount.push(task);
  }

  beforeUpdate(task: Task) {
    this.#lifecycle.beforeUpdate.push(task);
  }

  afterUpdate(task: Task) {
    this.#lifecycle.afterUpdate.push(task);
  }

  beforeUnmount(task: Task) {
    this.#lifecycle.beforeUnmount.push(task);
  }

  getUpdater() {
    return this.#update;
  }

  shouldUpdate(pred: (prevProps: Props, nextProps: Props) => boolean) {
    (this.preactComponent as any).__shouldComponentUpdate = (
      nextProps: Props
    ) => {
      return pred(this.preactComponent.props, nextProps);
    };
  }

  consumeContext<T>(ctx: Context<T>): () => T {
    return () => {
      const preactCtx = (ctx.constructor as any).__preactCtx;
      const preactCtxObj = this.preactComponent.context;

      const provider = !preactCtxObj
        ? null
        : preactCtxObj[(preactCtx as any)[keyContextId]];

      return !provider
        ? (ctx as any)[keyContextDefaultValue]
        : provider.props.value;
    };
  }
}

class BaseComponent<P extends Props> extends PreactComponent<
  P,
  { dummy: number }
> {
  static nextId = 0;

  #id: string;
  #ctrl: ComponentCtrl;
  #emit: null | ((event: LifecycleEvent) => void) = null;
  #mounted = false;
  #main: any;
  #propsObj: any;
  #render: null | (() => VNode) = null;
  #isFactoryFunction: boolean | undefined = undefined;
  #usesHooks = false;
  #usesExtensions = false;

  #update = (force?: boolean) => {
    if (force) {
      this.forceUpdate();
    } else {
      this.setState({ dummy: (this.state.dummy + 1) % 1000000000 });
    }
  };

  constructor(props: P, main: Component<P>) {
    super(props);
    this.state = { dummy: 0 };
    this.#main = main;

    this.#id = Date.now() + '-' + BaseComponent.nextId++;
    BaseComponent.nextId = BaseComponent.nextId % 200000000;

    const propsObjClass = class extends Object {
      static __preactClass = this.constructor;
    };

    this.#propsObj = Object.assign(new propsObjClass(), props);

    this.#ctrl = new Controller(this, this.#update, (handler: any) => {
      this.#emit = handler;
    });

    this.#ctrl.beforeUpdate(() => {
      for (const key in this.#propsObj) {
        delete this.#propsObj[key];
      }

      Object.assign(this.#propsObj, this.props);
    });
  }

  componentDidMount() {
    if (this.#ctrl) {
      this.#mounted = true;
      this.#emit && this.#emit('afterMount');
    }
  }

  componentDidUpdate() {
    this.#emit && this.#emit('afterUpdate');
  }

  componentWillUnmount() {
    this.#emit && this.#emit('beforeUnmount');
  }

  shouldComponentUpdate(nextProps: P) {
    if (!(this as any).__shouldComponentUpdate) {
      return true;
    }

    return (this as any).__shouldComponentUpdate(this.props, nextProps);
  }

  render() {
    let content: any;
    let getCtrl: ComponentCtrlGetter | null = null;

    if (this.#isFactoryFunction === undefined) {
      getCtrl = (intention) => {
        this.#usesExtensions ||= intention === 2;
        this.#usesHooks ||= intention === 1;

        if (this.#usesHooks && this.#usesExtensions) {
          throw (
            `Component "${getComponentName(
              this.constructor
            )}" illegally uses hooks and ` + 'extensions at the same time'
          );
        }

        return this.#ctrl;
      };

      onInit(
        () => {
          onRender(
            () => {
              const result = this.#main(this.#propsObj);

              if (typeof result === 'function') {
                if (this.#usesHooks) {
                  throw new Error(
                    `Component "${getComponentName(this.constructor)}" ` +
                      'uses hooks but returns a render function - this is ' +
                      'not allowed'
                  );
                }

                this.#isFactoryFunction = true;
                this.#render = result;
              } else {
                if (this.#usesExtensions) {
                  throw new Error(
                    `Component "${getComponentName(
                      component
                    )}" uses extensions ` +
                      'but does not return a render function - this is not allowed'
                  );
                }

                this.#isFactoryFunction = false;
                content = result ?? null;
              }
            },
            this.#id,
            this.#mounted ? null : getCtrl
          );
        },
        this.#id,
        getCtrl
      );
    }

    if (this.#mounted) {
      this.#emit!('beforeUpdate');
    }

    if (this.#isFactoryFunction) {
      let content: any = null;

      if (!this.#mounted) {
        onRender(() => (content = this.#render!()), this.#id, getCtrl);
      } else {
        onRender(
          () => {
            content = this.#render!();
          },
          this.#id,
          null
        );
      }

      return content;
    } else {
      if (content === undefined) {
        onRender(
          () => {
            content = this.#main(this.#propsObj);
          },
          this.#id,
          null
        );
      }

      return content;
    }
  }
}

function getComponentName(component: Function) {
  return (component as any).displayName || component.name;
}

// === exported functions ============================================

function intercept(params: {
  onCreateElement?(
    next: () => void,
    type: string | Function,
    props: Props
  ): void;

  onInit?(
    next: () => void,
    componentId: string,
    getCtrl: ComponentCtrlGetter
  ): void;

  onRender?(
    next: () => void,
    componentId: string,
    getCtrl: ComponentCtrlGetter | null
  ): void;
}) {
  if (params.onCreateElement) {
    if (!onCreateElement) {
      const noop = () => {};
      onCreateElement = noop;

      options.vnode = (vnode) => {
        let type = vnode.type;

        if (typeof type === 'function') {
          const type2 = (type as any).__preactClass;

          if (type2) {
            type = type2;
          }
        }

        onCreateElement!(noop, vnode.type, vnode.props);
      };
    }

    const oldOnCreateElement = onCreateElement;
    const newOnCreateElement = params.onCreateElement;

    onCreateElement = (next, type, props) =>
      void newOnCreateElement(
        () => oldOnCreateElement(next, type, props),
        type,
        props
      );
  }

  if (params.onInit) {
    const oldOnInit = onInit;
    const newOnInit = params.onInit;

    onInit = (next, componentId, getCtrl) =>
      void newOnInit(
        () => oldOnInit(next, componentId, getCtrl),
        componentId,
        getCtrl
      );
  }

  if (params.onRender) {
    const oldOnRender = onRender;
    const newOnRender = params.onRender;

    onRender = (next, componentId, getCtrl) =>
      void newOnRender(
        () => oldOnRender(next, componentId, getCtrl),
        componentId,
        getCtrl
      );
  }
}

function render(content: JSX.Element, container: Element | string) {
  const target =
    typeof container === 'string'
      ? document.querySelector(container)
      : container;

  if (!target) {
    throw Error('Invalid argument "container" used for function "render"');
  }

  preactRender(content, target);
}

function component(
  name: string
): <P extends Props>(fn: Component<P>) => ComponentClass<P>;

function component<P extends Props>(
  name: string,
  fn: Component<P>
): ComponentClass<P>;

function component(arg1: any, arg2?: any): any {
  if (arguments.length === 1) {
    return (fn: Component<any>) => component(arg1, fn);
  }

  const clazz = class extends BaseComponent<any> {
    constructor(props: unknown) {
      super(props, arg2);
    }
  };

  setName(clazz, arg1);
  setProperty(clazz, '__component', arg2);
  return clazz;
}

function createElement<P extends Props>(
  type: string | Component<any>,
  props: P,
  ...children: VNode[]
): JSX.Element {
  if (typeof type === 'string') {
    return preactCreateElement(type, props, ...children);
  }

  let preactClass: any = (type as any).__preactClass;

  if (!preactClass) {
    preactClass = component(type.name, type);
    (type as any).__preactClass = preactClass;
  }

  return preactCreateElement(preactClass, props, ...children);
}

// === contexts ======================================================

function createContext<T>(
  contextName: string,
  defaultValue: T
): [Context<T>, Component<{ value: T }>] {
  const preactCtx = createPreactContext(defaultValue);
  preactCtx.displayName = `InnerProvider(${contextName})`;

  class Ctx {
    static __preactCtx = preactCtx;
  }

  const context = Object.assign(new Ctx(), {
    contextName,
    defaultValue
  });

  function Provider({ value, children }: any) {
    return preactCreateElement(preactCtx.Provider, { value, children });
  }

  setName(Provider, `Provider(${contextName})`);

  return [context, Provider];
}

// === Fragment ======================================================

setProperty(Fragment, '__component', Fragment);
setProperty(Fragment, '__preactClass', Fragment);

// === Boundary ======================================================

class PreactBoundary extends PreactComponent<{
  fallback: ((error: any, retry: () => void) => void) | VNode;
  children?: VNode;
}> {
  #hasError = false;
  #error: any = null;

  #reset = () => {
    if (this.#hasError) {
      this.forceUpdate();
    }

    this.#hasError = false;
    this.#error = null;
  };

  componentDidCatch(error: any) {
    this.#hasError = true;
    this.#error = error;

    const fallback = this.props.fallback;

    if (typeof fallback === 'function') {
      fallback(error, this.#reset);
    }
  }

  shouldComponentUpdate() {
    return !this.#hasError || typeof this.props.fallback !== 'function';
  }

  render() {
    return this.#hasError
      ? this.props.fallback
      : preactCreateElement(Fragment, null, this.props.children);
  }
}

function Boundary(props: { fallback: VNode }) {
  return preactCreateElement(PreactBoundary, props);
}

setProperty(Boundary, '__preactClass', PreactBoundary);
setName(Boundary, 'Boundary');

// === Suspense ======================================================

setProperty(Suspense, '__component', Suspense);
setProperty(Suspense, '__preactClass', Suspense);
setName(Suspense, 'Suspense');

// === virtual elements ==============================================

function getType(vnode: VNode): string | Component | null {
  if (vnode && 'type' in vnode) {
    if (typeof vnode.type === 'string') {
      return vnode.type;
    } else if ('__preactClass' in vnode.type) {
      return (vnode.type as any).__component;
    }
  }

  return null;
}

function getProps(vnode: VNode): Props | null {
  return vnode && 'type' in vnode && 'props' in vnode ? vnode.props : null;
}

// === utilities =====================================================

function setProperty(obj: object, name: string, value: any) {
  Object.defineProperty(obj, name, {
    value
  });
}

function setName(obj: object, name: string) {
  setProperty(obj, 'name', name);
}
