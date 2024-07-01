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

export function jsx(type: ElementType, config: any = {}, maybeKey: any) {
  let propName;
  // Reserved names are extracted
  const props = {};
  let key = null;
  let ref = null;
  if (maybeKey !== undefined) {
    key = '' + maybeKey;
  }
  if (config !== null) {
    if (hasValidRef(config)) {
      ref = config.ref;
    }

    if (hasValidKey(config)) {
      key = config.key;
    }

    if (config !== null) {
      for (propName in config) {
        if (hasOwnProperty.call(config, propName)) {
          props[propName] = config[propName];
        }
      }
    }
  }
  return ReactElement(type, key, ref, props);
}

export const jsxDEV = jsx;
