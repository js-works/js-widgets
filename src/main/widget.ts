import {} from 'js-widgets';
import type { ComponentCtrl, Props, VNode } from 'js-widgets';
import { setName } from 'js-widgets/util';

// === exports =======================================================

export { opt, props, req, widget };
export type { ComponentCtrl, PropDef, PropsDef };

// === types =========================================================

type Func<A extends any[], R> = (...args: A) => R;
type ComponentFunc<P extends Props> = (p: P) => () => VNode;
type PropDefReq<T> = { required: true };
type PropDefOpt<T> = { required: false; defaultValue: never };
type PropDefVal<T> = { required: false; defaultValue: T };

type PropDef<T> = PropDefReq<T> | PropDefOpt<T> | PropDefVal<T>;
type PropsDef = Record<string, PropDef<unknown>>;
type Prettify<T extends {}> = { [K in keyof T]: T[K] };

type PropsType1<T extends PropsDef> = Prettify<
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

type PropsType2<T extends PropsDef> = Prettify<
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
        : never]: T[K] extends PropDefVal<infer U> ? U : never;
    }
>;
type Modifier<A1 extends any[], A2 extends any[]> = (
  fn: (...args: A1) => () => VNode
) => (...args: A2) => () => VNode;

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
): Modifier<[PropsType1<T>], [PropsType2<T>]> {
  return (fn: ComponentFunc<PropsType1<T>>) =>
    fn as ComponentFunc<PropsType2<T>>;
}

function widget(name: string, main: ComponentFunc<{}>): ComponentFunc<{}>;

function widget(
  name: string
): <P extends Props, A extends any[]>(
  modifier: Modifier<[P], A>
) => (fn: (...args: A) => () => VNode) => ComponentFunc<P>;

function widget(
  name: string
): <P extends Props, A1 extends any[], A2 extends any[]>(
  modifier1: Modifier<[P], A1>,
  modifier2: Modifier<A1, A2>
) => (fn: (...args: A2) => () => VNode) => ComponentFunc<P>;

function widget(
  name: string
): <P extends Props, A1 extends any[], A2 extends any[], A3 extends any[]>(
  modifier1: Modifier<[P], A1>,
  modifier2: Modifier<A1, A2>,
  modifier3: Modifier<A2, A3>
) => (fn: (...args: A3) => () => VNode) => ComponentFunc<P>;

function widget(name: string, arg2?: any): any {
  if (arguments.length > 1) {
    const ret = arg2.bind(null);

    setName(ret, name);
    return ret;
  }

  return (...modifiers: Modifier<unknown[], unknown[]>[]) => {
    if (modifiers.length > 3) {
      throw new Error('Too many modifiers');
    }

    return (props: Props) => {
      let result: any;

      modifiers.forEach((modifier, idx) => {
        if (idx === 0) {
          result = modifier;
        }
      });
    };
  };
}
