import type { Dispatch, Dispatcher } from 'react/src/currentDispatcher';
import internals from 'shared/internals';
import { Action } from 'shared/ReactTypes';
import type { FiberNode } from './fiber';
import {
  createUpdate,
  createUpdateQueue,
  enqueueUpdate,
  processUpdateQueue,
  UpdateQueue
} from './updateQueue';
import { scheduleUpdateOnFiber } from './workLoop';

let currentlyRenderingFiber: FiberNode | null = null;
let workInProgressHook: Hook | null = null;
let currentHook: Hook | null = null;
let { currentDispatcher } = internals;
interface Hook {
  // hook自身的状态值
  memoizedState: any;
  updateQueue: unknown;
  next: Hook | null;
}

export function renderWithHook(wip: FiberNode) {
  // 赋值
  currentlyRenderingFiber = wip;
  wip.memoizedState = null;

  const current = wip.alternate;

  if (current !== null) {
    // update
    currentDispatcher.current = HooksDispatcherOnUpdate;
  } else {
    // mount
    currentDispatcher.current = HooksDispatcherOnMount;
  }

  const Component = wip.type;
  const props = wip.pendingProps;
  const children = Component(props);
  //重制
  currentlyRenderingFiber = null;

  return children;
}

const HooksDispatcherOnMount: Dispatcher = {
  useState: mountState
};

const HooksDispatcherOnUpdate: Dispatcher = {
  useState: updateState
};

// updateState
function updateState<State>(): [State, Dispatch<State>] {
  const hook = updateWorkInProgressHook();
  const queue = hook.updateQueue as UpdateQueue<State>;
  // const pending = queue.shared.pending;

  const memoizedState = processUpdateQueue(
    hook.memoizedState,
    queue,
    currentlyRenderingFiber
  );
  hook.memoizedState = memoizedState;

  return [hook.memoizedState, queue.dispatch as Dispatch<State>];
}

function mountState<State>(
  initialState: State | (() => State)
): [State, Dispatch<State>] {
  // 当前useState对应的hook数据
  const hook = mountWorkInProgressHook();
  let memoizedState;
  if (initialState instanceof Function) {
    memoizedState = initialState();
  } else {
    memoizedState = initialState;
  }
  const queue = createUpdateQueue();
  hook.updateQueue = queue;
  hook.memoizedState = memoizedState;

  const dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue);
  queue.dispatch = dispatch;

  return [memoizedState, dispatch];
}

function dispatchSetState<State>(
  fiber: FiberNode,
  updateQueue: UpdateQueue,
  action: Action<State>
) {
  const update = createUpdate(action);
  enqueueUpdate(updateQueue, update);
  scheduleUpdateOnFiber(fiber);
}

function updateWorkInProgressHook(): Hook {
  // TODO render阶段触发的更新
  let nextCurrentHook: Hook | null;

  if (currentHook === null) {
    // 这是这个FC update时的第一个hook
    const current = currentlyRenderingFiber?.alternate;
    if (current !== null) {
      nextCurrentHook = current?.memoizedState;
    } else {
      // mount
      nextCurrentHook = null;
    }
  } else {
    // 这个FC update时 后续的hook
    nextCurrentHook = currentHook.next;
  }

  if (nextCurrentHook === null) {
    // mount/update u1 u2 u3
    // update       u1 u2 u3 u4
    throw new Error(
      `组件${currentlyRenderingFiber?.type}本次执行时的Hook比上次执行时多`
    );
  }

  currentHook = nextCurrentHook as Hook;
  const newHook: Hook = {
    memoizedState: currentHook.memoizedState,
    updateQueue: currentHook.updateQueue,
    next: null
  };
  if (workInProgressHook === null) {
    // mount时 第一个hook
    if (currentlyRenderingFiber === null) {
      throw new Error('请在函数组件内调用hook');
    } else {
      workInProgressHook = newHook;
      currentlyRenderingFiber.memoizedState = workInProgressHook;
    }
  } else {
    // mount时 后续的hook
    workInProgressHook.next = newHook;
    workInProgressHook = newHook;
  }
  return workInProgressHook;
}

// 获取hook对应的数据
function mountWorkInProgressHook(): Hook {
  const hook: Hook = {
    memoizedState: null,
    updateQueue: null,
    next: null
  };
  if (workInProgressHook === null) {
    // mount 时 第一个hook
    if (currentlyRenderingFiber === null) {
      throw new Error('请在函数组件内部调用hooks');
    } else {
      workInProgressHook = hook;
      currentlyRenderingFiber.memoizedState = workInProgressHook;
    }
  } else {
    // mount 时 后序的hook
    workInProgressHook.next = hook;
    workInProgressHook = workInProgressHook.next;
  }

  return hook;
}
