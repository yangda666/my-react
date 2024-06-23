// import type { WorkTag } from './workTags';

import type { Container } from 'hostConfig';
import type { Props, ReactElementType, Ref } from '../../shared/ReactTypes';
import { NoFlags, type Flags } from './fiberFlags';
import { FunctionComponent, HostComponent, type WorkTag } from './workTags';

export class FiberNode {
  tag: WorkTag;
  key: null | string;
  elementType: any;
  type: any;
  ref: Ref;
  stateNode: any;
  return: FiberNode | null;
  child: FiberNode | null;
  sibling: FiberNode | null;
  index: number;
  alternate: FiberNode | null;
  pendingProps: Props;
  memoizedProps: Props | null;
  memoizedState: any;
  flags: Flags;
  subtreeFlags: Flags;
  deletions: Flags[] | null;
  updateQueue: unknown;
  constructor(tag: WorkTag, pendingProps: Props, key: null | string) {
    // Instance
    this.tag = tag;
    this.key = key;
    this.elementType = null;
    this.type = null;
    this.stateNode = null;
    // Fiber
    this.return = null;
    this.child = null;
    this.sibling = null;
    this.index = 0;
    // 工作单元
    this.pendingProps = pendingProps;
    this.memoizedProps = null;
    this.memoizedState = null;
    this.updateQueue = null;
    // this.memoizedState = null;
    // this.dependencies = null;
    // deletions: Array<Fiber> | null,
    // Effects
    this.flags = NoFlags;
    this.subtreeFlags = NoFlags;
    this.deletions = null;

    // this.lanes = NoLanes;
    // this.childLanes = NoLanes;
    this.ref = null;
    this.alternate = null;
  }
}

export class FiberRootNode {
  container: Container;
  current: FiberNode;
  finishedWork: FiberNode | null;
  constructor(container: Container, hostRootFiber: FiberNode) {
    this.container = container;
    this.current = hostRootFiber;
    hostRootFiber.stateNode = this;
    this.finishedWork = null;
  }
}

export const createWorkInProgress = (
  current: FiberNode,
  pendingProps: Props
): FiberNode => {
  let wip = current.alternate;

  if (wip === null) {
    // mount阶段
    wip = new FiberNode(current.tag, pendingProps, current.key);
    wip.stateNode = current.stateNode;
    wip.alternate = current;
    current.alternate = wip;
  } else {
    wip.pendingProps = pendingProps;
    wip.flags = NoFlags;
  }
  wip.type = current.type;
  wip.updateQueue = current.updateQueue;
  wip.memoizedProps = current.memoizedProps;
  wip.memoizedState = current.memoizedState;
  wip.child = current.child;
  return wip;
};
export function createFiberFormElemnt(element: ReactElementType) {
  const { key, type, props } = element;
  let fiberTag: WorkTag = FunctionComponent;
  if (typeof type === 'string') {
    fiberTag = HostComponent;
  } else if (typeof type === 'function' && __DEV__) {
    console.warn('未定义的type类型', element);
  }
  const fiber = new FiberNode(fiberTag, props, key);
  fiber.type = type;
  return fiber;
}
