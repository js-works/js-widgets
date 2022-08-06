import { h, Fragment } from 'js-widgets';

// TODO - fix this: use `jsx` from `preact/jsx-runtime`!
function f(type: any, props: any, key: any, __self?: any, __source?: any) {
  let p = null;
  let children: any = null;

  if (props) {
    children = props.children || null;

    if (children && !Array.isArray(children)) {
      children = [children];
    }

    if (key != undefined) {
      p = { ...props, key };
    } else {
      p = props;
    }
  }

  return children ? h(type, p, ...children) : h(type, p);
}

export { f as jsx, f as jsxs, f as jsxDEV, Fragment };
