import { Action } from 'shared/ReactTypes';

export interface Dispatcher {
  useState: <T>(initialState: () => T | T) => [T, Dispatch<T>];
}

export type Dispatch<State> = (action: Action<State>) => State;

const currentDispatcher: { current: Dispatcher | null } = {
  current: null
};
export const resolveDispatcher = () => {
  const dispatcher = currentDispatcher.current;
  if (dispatcher === null) {
    throw new Error('hook只能在函数组件中执行');
  }
  return dispatcher;
};

export default currentDispatcher;
