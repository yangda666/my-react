import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbol';
import hasOwnProperty from 'shared/hasOwnProperty';

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
  if (hasOwnProperty.call(config, 'ref')) {
    const getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
    if (getter) {
      return false;
    }
  }
  return config.ref !== undefined;
}

function hasValidKey(config) {
  if (hasOwnProperty.call(config, 'key')) {
    const getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
    if (getter) {
      return false;
    }
  }
  return config.ref !== undefined;
}

export function jsx(type, config, maybeKey) {
  let propName;
  // Reserved names are extracted
  const props = {};
  let key = null;
  let ref = null;
  if (hasValidRef(config)) {
    ref = config.ref;
  }
  if (maybeKey !== undefined) {
    key = '' + maybeKey;
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
  return ReactElement(type, key, ref, props);
}

export const jsxDEV = jsx;
