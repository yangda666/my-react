import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import {
  createWorkInProgress,
  type FiberNode,
  type FiberRootNode
} from './fiber';
import { MutationMask, NoFlags } from './fiberFlags';
import { HostRoot } from './workTags';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let workInProgress: FiberNode | null = null;

// 设置当前的工作单元
function prepareFreshStack(root: FiberRootNode | null) {
  workInProgress = createWorkInProgress(root.current, null);
}

export function scheduleUpdateOnFiber(fiber: FiberNode) {
  // 调度
  const root = markUpdateFormFiberToRoot(fiber);
  renderRoot(root);
}
function markUpdateFormFiberToRoot(fiber: FiberNode) {
  let node = fiber;
  let parent = fiber.return;
  while (parent !== null) {
    node = parent;
    parent = node.return;
  }
  if (node.tag === HostRoot) {
    return node.stateNode;
  }
  return null;
}
// 渲染 根 Fiber
export function renderRoot(root: FiberRootNode) {
  prepareFreshStack(root);
  do {
    try {
      workLoop();
      break;
    } catch (error) {
      if (__DEV__) {
        console.warn('workLoop错误');
      }
      prepareFreshStack(null);
    }
    // eslint-disable-next-line no-constant-condition
  } while (true);
  const finishedWork = root.current.alternate;
  root.finishedWork = finishedWork;
  commitRoot(root);
}

function commitRoot(root: FiberRootNode) {
  const finishedWork = root.finishedWork;
  if (finishedWork === null) {
    return;
  }
  if (__DEV__) {
    console.warn('commit阶段开始', finishedWork);
  }
  root.finishedWork = null;
  // 判断三个阶段
  // beforeMutation
  // Mutation
  // layout
  const subtreeHasEffect =
    (finishedWork.subtreeFlags & MutationMask) !== NoFlags;
  const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags;
  if (subtreeHasEffect || rootHasEffect) {
    // beforeMutation
    // Mutation
    root.current = finishedWork;
    // layout
  } else {
    root.current = finishedWork;
  }
}
// 开始
function workLoop() {
  while (workInProgress !== null) {
    perFormUnitOfWork(workInProgress);
  }
}

// 执行工作单元
function perFormUnitOfWork(fiber: FiberNode) {
  const next = beginWork(fiber);
  fiber.memoizedProps = fiber.pendingProps;
  if (next === null) {
    completeUniOfWork(fiber);
  } else {
    workInProgress = next;
  }
}

// 完成的工作单元
function completeUniOfWork(fiber: FiberNode) {
  let node = fiber;
  do {
    completeWork(node);
    const sibling = node.sibling;
    if (sibling) {
      workInProgress = sibling;
    }
    node = node.return;
    workInProgress = node;
  } while (node !== null);
}
