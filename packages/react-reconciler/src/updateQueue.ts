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

export const enqueueUpdate = (fiber: FiberNode, update: Update) => {
  const updateQueue = fiber.updateQueue;
  if (updateQueue !== null) {
    updateQueue.shared.pending = update;
  }
};

// 消费
export const processUpdateQueue = (fiber: FiberNode) => {
  const updateQueue = fiber.updateQueue;
  let newState = null;
  if (updateQueue) {
    const pending = updateQueue.shared.pending;
    const pendingUpdate = pending;
    updateQueue.shared.pending = null;

    if (pendingUpdate !== null) {
      const action = pendingUpdate.action;
      if (typeof action === 'function') {
        newState = action();
      } else {
        newState = action;
      }
    }
  } else {
    console.error(fiber, ' processUpdateQueue时 updateQueue不存在');
  }
  fiber.memoizedState = newState;
};
