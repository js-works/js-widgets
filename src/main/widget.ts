import type { ComponentCtrl, Props, VNode } from './core';

// === exports =======================================================

export { opt, props, req, widget };
export type { ComponentCtrl, PropDef, PropsDef };

// === types =========================================================

type ComponentFunc<P extends Props> = (p: P) => () => VNode;
type PropDefReq<T> = { required: true };
type PropDefOpt<T> = { required: false; defaultValue: never };
type PropDefVal<T> = { required: false; defaultValue: T };

type PropDef<T> = PropDefReq<T> | PropDefOpt<T> | PropDefVal<T>;
type PropsDef = Record<string, PropDef<unknown>>;
type Prettify<T extends {}> = T; //{ [K in keyof T]: T[K] };

type PropsType<T extends PropsDef> = Prettify<
  {
    [K in keyof T as T[K] extends PropDefReq<any>
      ? K
      : never]: T[K] extends PropDefReq<infer U> ? U : never;
  } &
    {
      [K in keyof T as T[K] extends PropDefOpt<any>
        ? K
        : never]?: T[K] extends PropDefOpt<infer U> ? U : never;
    } &
    {
      [K in keyof T as T[K] extends PropDefVal<any>
        ? K
        : never]?: T[K] extends PropDefVal<infer U> ? U : never;
    }
>;

type DefaultsType<T extends PropsDef> = {
  [K in keyof T as T[K] extends PropDefVal<any>
    ? K
    : never]: T[K] extends PropDefVal<infer U> ? U : never;
};

// TODO!!!!!!!
interface PropsConfig<P extends Props, D extends {}> {
  validateProps?: (nextProps: P, oldProps: P) => null | Error;
  defaults: D;
}

// === constants =====================================================

const symbolProps = Symbol('props');

// === local data ====================================================

const reqDef = Object.freeze({ required: true });
const optDef = Object.freeze({ required: false });

// === exported functions ============================================

function req<T>(): PropDefReq<T> {
  return reqDef;
}

function opt<T>(): PropDefOpt<T>;
function opt<T>(defaultValue?: T): PropDefVal<T>;

function opt(defaultValue?: any): any {
  return arguments.length > 0 ? { required: false, defaultValue } : optDef;
}

function props<T extends PropsDef>(
  propsDef: T
): PropsConfig<PropsType<T>, DefaultsType<T>> {
  const defaults: any = {};

  for (const key of Object.keys(propsDef)) {
    if (hasOwn(propsDef[key], 'defaultValue')) {
      defaults[key] = (propsDef[key] as any).defaultValue;
    }
  }

  return { defaults };
}

function widget(name: string, main: ComponentFunc<{}>): ComponentFunc<{}>;

function widget(
  name: string
): <P extends Props, D extends Partial<P>>(
  propsConfig: PropsConfig<P, D>
) => (fn: (props: Prettify<P & D>) => () => VNode) => ComponentFunc<P>;

function widget(name: string, arg2?: any): any {
  if (arguments.length > 1) {
    const ret = arg2.bind(null);

    Object.defineProperty(ret, 'name', {
      value: name
    });

    return ret;
  }

  return <P extends Props, D extends Partial<P>>(
    propsConfig: PropsConfig<P, D>
  ) => {
    const defaults = propsConfig.defaults || {};

    // TODO!!!!
    return (fn: Function) => {
      return (props: Props) => {
        (props.constructor as any).__defaults = defaults;

        for (const key of Object.keys(defaults)) {
          if (props[key] === undefined) {
            props[key] = defaults[key];
          }
        }

        return fn(props);
      };
    };
  };
}

// === utilities =====================================================

function hasOwn(subj: any, propName: string) {
  return subj != null && Object.prototype.hasOwnProperty.call(subj, propName);
}
