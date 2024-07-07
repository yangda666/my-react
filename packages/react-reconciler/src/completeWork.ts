import type { Instance } from 'hostConfig';
import {
  appendInitialChild,
  createInstance,
  createTextInstance
} from 'hostConfig';
import type { FiberNode } from './fiber';
import { NoFlags, Update } from './fiberFlags';
// import { createInstance, createTextInstance } from './hostConfig';
import { updateFiberProps } from '../../react-dom/src/SyntheticEvent';
import {
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText
} from './workTags';

function markUpdate(fiber: FiberNode) {
  fiber.flags |= Update;
}

// 对比 curret fiber 与 workInprogress Fiber 的变化创建出新的 element, 并将父作用向上冒泡
export const completeWork = (workInProgress: FiberNode) => {
  if (__DEV__) {
    console.log('complete流程', workInProgress.type);
  }
  const newProps = workInProgress.pendingProps;
  const current = workInProgress.alternate;
  switch (workInProgress.tag) {
    case HostComponent: {
      if (current !== null && workInProgress.stateNode) {
        // update
        // 1. props 是否变化
        // 2. 变了 Update Flag
        updateFiberProps(workInProgress.stateNode, newProps);
      } else {
        // mounted
        // 初始化DOM
        const instance = createInstance(workInProgress.type, newProps);
        // 挂载DOM
        appendAllChildren(instance, workInProgress);
        workInProgress.stateNode = instance;
      }
      // // 初始化DOM
      // const instance = createInstance(workInProgress.type);
      // // 挂载DOM
      // appendAllChildren(instance, workInProgress);
      // workInProgress.stateNode = instance;

      // 初始化元素属性 TODO

      // 冒泡flag
      bubbleProperties(workInProgress);
      return null;
    }
    case HostRoot:
      bubbleProperties(workInProgress);
      return null;
    case HostText: {
      if (current !== null && workInProgress.stateNode) {
        // update
        const oldText = current.memoizedProps?.content;
        const newText = newProps.content;
        if (oldText !== newText) {
          markUpdate(workInProgress);
        }
      } else {
        // 初始化DOM
        const textInstanve = createTextInstance(newProps.content);
        workInProgress.stateNode = textInstanve;
        // 冒泡flag
      }
      bubbleProperties(workInProgress);
      return null;
    }
    case FunctionComponent: {
      bubbleProperties(workInProgress);
      return null;
    }
    default:
      console.error('completeWork未定义的fiber.tag', workInProgress);
      return null;
  }
};

// 递归处理将所有的子节点挂在父容器中
const appendAllChildren = (parent: Instance, workInProgress: FiberNode) => {
  // 遍历workInProgress所有子孙 DOM元素，依次挂载
  let node = workInProgress.child;
  while (node !== null) {
    if (node.tag === HostComponent || node.tag === HostText) {
      appendInitialChild(parent, node.stateNode);
    } else if (node.child !== null) {
      node.child.return = node;
      node = node.child;
      continue;
    }

    if (node === workInProgress) {
      return;
    }

    while (node.sibling === null) {
      if (node.return === null || node.return === workInProgress) {
        return;
      }
      node = node.return;
    }
    node.sibling.return = node.return;
    node = node.sibling;
  }
};
function bubbleProperties(completedWork: FiberNode) {
  let subtreeFlags = NoFlags;
  let child = completedWork.child;
  while (child !== null) {
    subtreeFlags |= child.subtreeFlags;
    subtreeFlags |= child.flags;
    child.return = completedWork;
    child = child.sibling;
  }
  completedWork.subtreeFlags |= subtreeFlags;
}
