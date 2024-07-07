import { beginWork } from './beginWork';
import { commitMutationEffects } from './commitWork';
import { completeWork } from './completeWork';
import {
  createWorkInProgress,
  type FiberNode,
  type FiberRootNode
} from './fiber';
import { MutationMask, NoFlags } from './fiberFlags';
import { HostRoot } from './workTags';

let workInProgress: FiberNode | null = null;

// 设置当前的工作单元
function prepareFreshStack(root: FiberRootNode | null) {
  if (root !== null) {
    workInProgress = createWorkInProgress(root.current, null);
  }
}

// 进行开始深度便利
export function scheduleUpdateOnFiber(fiber: FiberNode) {
  // 获取到根节点
  const root = markUpdateFormFiberToRoot(fiber);
  if (root === null) {
    return;
  }
  //
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
// 从 根 Fiber 开始 renconciler
export function renderRoot(root: FiberRootNode) {
  prepareFreshStack(root);
  do {
    try {
      workLoop();
      break;
    } catch (error) {
      if (__DEV__) {
        console.warn('workLoop错误', error);
        workInProgress = null;
      }
      prepareFreshStack(null);
    }
    // eslint-disable-next-line no-constant-condition
  } while (true);

  if (workInProgress !== null) {
    console.error('render阶段结束时wip不为null');
  }
  const finishedWork = root.current.alternate;
  root.finishedWork = finishedWork;
  // 所有fiber节点 WipTree 构建完成 开始更新副作用
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
    commitMutationEffects(finishedWork);

    // layout
    root.current = finishedWork;
  } else {
    root.current = finishedWork;
  }
  if (__DEV__) {
    console.warn('commit阶段结束', finishedWork);
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
  // 执行完beginWork后，pendingProps 变为 memoizedProps
  fiber.memoizedProps = fiber.pendingProps;
  if (next === null) {
    completeUnitOfWork(fiber);
  } else {
    workInProgress = next;
  }
}

// 完成的工作单元
function completeUnitOfWork(fiber: FiberNode) {
  let node: FiberNode | null = fiber;
  do {
    const next = completeWork(node);
    if (next !== null) {
      workInProgress = next;
      return;
    }
    const sibling = node.sibling;
    if (sibling) {
      workInProgress = sibling;
      return;
    }
    node = node.return;
    workInProgress = node;
  } while (node !== null);
}
