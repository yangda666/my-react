import { Dispatch } from '../../react/src/currentDispatcher';
import type { FiberNode } from './fiber';
type UpdateAction = any;

export interface Update {
  action: UpdateAction;
}

export type UpdateQueue<State = any> = {
  shared: {
    pending: Update | null;
  };
  dispatch: Dispatch<State> | null;
};

export const createUpdate = (action: UpdateAction) => {
  return {
    action
  };
};

export const createUpdateQueue = () => {
  return {
    shared: {
      pending: null
    },
    dispatch: null
  };
};

export const enqueueUpdate = (updateQueue: UpdateQueue, update: Update) => {
  updateQueue.shared.pending = update;
};

// 消费
export const processUpdateQueue = <State>(
  baseState: State,
  updateQueue: UpdateQueue<State>,
  fiber: FiberNode | null = null
): State => {
  if (updateQueue !== null) {
    const pending = updateQueue.shared.pending;
    const pendingUpdate = pending;
    updateQueue.shared.pending = null;

    if (pendingUpdate !== null) {
      const action = pendingUpdate.action;
      if (action instanceof Function) {
        baseState = action(baseState);
      } else {
        baseState = action;
      }
    }
  } else {
    console.error(fiber, 'processUpdateQueue时 updateQueue不存在');
  }
  return baseState;
};
