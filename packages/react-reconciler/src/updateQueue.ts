import type { Action } from '../../shared/ReactTypes';

export type Update<S> = {
  action: Action<S>;
  // hasEagerState: boolean;
  // eagerState: S | null;
  // next: Update<S>;
};

export type UpdateQueue<S> = {
  shared: {
    pending: Update<S> | null;
  };
};

export const createUpdate = <S>(action: Action<S>) => {
  return {
    action
  };
};

export const createUpdateQueue = <S>() => {
  return {
    shared: {
      pending: null
    }
  } as UpdateQueue<S>;
};

export const enqueueUpdate = <A>(
  updateQueue: UpdateQueue<A>,
  update: Update<A>
) => {
  updateQueue.shared.pending = update;
};

export const processUpdateQueue = <S>(
  baseState: S,
  pendingUpdate: Update<S>
): { memoizedState: S } => {
  const result: ReturnType<typeof processUpdateQueue<S>> = {
    memoizedState: baseState
  };
  if (pendingUpdate !== null) {
    const action = pendingUpdate.action;
    if (action instanceof Function) {
      result.memoizedState = action(baseState);
    } else {
      result.memoizedState = action;
    }
  }
  return result;
};
