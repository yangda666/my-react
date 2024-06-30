import type { Dispatch, Dispatcher } from 'react/src/currentDispatcher';
import internals from 'shared/internals';
import { Action } from 'shared/ReactTypes';
import type { FiberNode } from './fiber';
import {
  createUpdate,
  createUpdateQueue,
  enqueueUpdate,
  UpdateQueue
} from './updateQueue';
import { scheduleUpdateOnFiber } from './workLoop';

let currentlyRenderingFiber: FiberNode | null = null;
let workInProgressHook: Hook | null = null;
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

  const dispatch = dispatchSetState.bind(null, currentlyRenderingFiber);

  queue.dispatch = dispatch;

  // hook.memoizedState = memoizedState;
  return [memoizedState, dispatch];
}

function dispatchSetState<State>(
  fiber: FiberNode,
  updateQueue: UpdateQueue,
  action: Action<State>
) {
  const update = createUpdate(action);
  enqueueUpdate(fiber, update);
  scheduleUpdateOnFiber(fiber);
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
