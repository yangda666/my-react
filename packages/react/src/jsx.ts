import hasOwnProperty from 'shared/hasOwnProperty';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbol';
import { ElementType } from 'shared/ReactTypes';

// React Element
export function ReactElement(type, key, ref, props) {
  const element = {
    $$typeof: REACT_ELEMENT_TYPE,
    // Built-in properties that belong on the element
    type,
    key,
    ref: ref,
    props,
    // Record the component responsible for creating this element.
    _owner: '_Yzj'
  };
  return element;
}
function hasValidRef(config) {
  // if (__DEV__) {
  //   if (hasOwnProperty.call(config, 'ref')) {
  //     const getter = Object.getOwnPropertyDescriptor(config, 'ref').get as any;
  //     if (getter && getter.isReactWarning) {
  //       return false;
  //     }
  //   }
  // }
  return config.ref !== undefined;
}

function hasValidKey(config) {
  // if (__DEV__) {
  //   if (hasOwnProperty.call(config, 'key')) {
  //     const getter = Object.getOwnPropertyDescriptor(config, 'key').get as any;
  //     if (getter && getter.isReactWarning) {
  //       return false;
  //     }
  //   }
  // }
  return config.key !== undefined;
}

export function createElement(
  type: ElementType,
  config: any = {},
  ...children: any
) {
  let propName;
  // Reserved names are extracted
  const props = {};
  let key: string | null = null;
  let ref = null;

  if (config !== null) {
    for (propName in config) {
      if (hasOwnProperty.call(config, propName)) {
        if (hasValidRef(config)) {
          ref = config.ref;
        }
        if (hasValidKey(config)) {
          key = '' + config.key;
        }
        if (propName !== 'key' && propName !== 'ref') {
          props[propName] = config[propName];
        }
      }
    }
  }
  if (children !== undefined && children.length > 0) {
    if (children.length === 1) {
      props['children'] = children[0];
    } else {
      props['children'] = children;
    }
  }

  return ReactElement(type, key, ref, props);
}

export const jsx = (type: ElementType, config: any, maybeKey: any) => {
  let key: string | null = null;
  const props = {};
  let ref = null;

  if (maybeKey !== undefined) {
    key = '' + maybeKey;
  }

  for (const prop in config) {
    const val = config[prop];
    if (prop === 'key') {
      if (val !== undefined) {
        key = '' + val;
      }
      continue;
    }
    if (prop === 'ref') {
      if (val !== undefined) {
        ref = val;
      }
      continue;
    }
    if ({}.hasOwnProperty.call(config, prop)) {
      props[prop] = val;
    }
  }

  return ReactElement(type, key, ref, props);
};

export const jsxDEV = jsx;
