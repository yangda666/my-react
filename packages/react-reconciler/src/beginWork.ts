import type { ReactElementType } from '../../shared/ReactTypes';
import { mountChildFiber, reconcileChildFibers } from './childFibers';
import type { FiberNode } from './fiber';
import { renderWithHook } from './fiberHooks';
import { processUpdateQueue, UpdateQueue } from './updateQueue';
import {
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText
} from './workTags';
// 计算状态的最新值 和 创造子的fiber
export function beginWork(wip: FiberNode) {
  switch (wip.tag) {
    case HostRoot:
      return updateHostRoot(wip);
    case HostComponent:
      return updateHostComponent(wip);
    case FunctionComponent:
      return updateFunctionComponent(wip);
    case HostText:
      return null;
    default:
      if (__DEV__) {
        console.warn('beginWork未实现的类型');
      }
      return null;
  }
}

function updateHostRoot(wip: FiberNode) {
  const baseState = wip.memoizedState;
  const updateQueue = wip.updateQueue as UpdateQueue<Element>;
  wip.memoizedState = processUpdateQueue(baseState, updateQueue, wip);
  const nextChildren = wip.memoizedState;
  reconcileChildren(wip, nextChildren);
  return wip.child;
}

// 函数式组件的renconciler
function updateFunctionComponent(wip: FiberNode) {
  const nextChildren = renderWithHook(wip);
  reconcileChildren(wip, nextChildren);
  return wip.child;
}

// function reconcilerChildren(wip: FiberNode, reconcilerChildren: type) {}

function updateHostComponent(wip: FiberNode) {
  const nextProps = wip.pendingProps;
  const nextChildren = nextProps.children;
  reconcileChildren(wip, nextChildren);
  return wip.child;
}

function reconcileChildren(wip: FiberNode, children: ReactElementType) {
  const current = wip.alternate;
  if (current !== null) {
    wip.child = reconcileChildFibers(wip, current?.child, children);
  } else {
    wip.child = mountChildFiber(wip, null, children);
  }
}
