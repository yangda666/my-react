import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbol';
import currentDispatcher, {
  Dispatcher,
  resolveDispatcher
} from './src/currentDispatcher';
import { createElement as createElementFn } from './src/jsx';

export const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
  currentDispatcher
};

export const useState: Dispatcher['useState'] = (initialState) => {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
};

export const isValidElement = (element: any) => {
  return (
    typeof element === 'object' &&
    element !== null &&
    element.$$typeof === REACT_ELEMENT_TYPE
  );
};
export const version = '0.0.1';
// export const createElement = jsx;
export const createElement = createElementFn;

export default {
  version,
  createElement
};
