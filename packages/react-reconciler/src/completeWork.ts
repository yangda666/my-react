import type { Instance } from 'hostConfig';
import {
  appendInitialChild,
  createInstance,
  createTextInstance
} from 'hostConfig';
import type { FiberNode } from './fiber';
import { NoFlags } from './fiberFlags';
// import { createInstance, createTextInstance } from './hostConfig';
import {
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText
} from './workTags';

export const completeWork = (workInProgress: FiberNode) => {
  const newProps = workInProgress.pendingProps;

  switch (workInProgress.tag) {
    case HostComponent: {
      // 初始化DOM
      const instance = createInstance(workInProgress.type);
      // 挂载DOM
      appendAllChildren(instance, workInProgress);
      workInProgress.stateNode = instance;

      // 初始化元素属性 TODO

      // 冒泡flag
      bubbleProperties(workInProgress);
      return null;
    }
    case HostRoot:
      bubbleProperties(workInProgress);
      return null;
    case HostText: {
      // 初始化DOM
      const textInstanve = createTextInstance(newProps.content);
      workInProgress.stateNode = textInstanve;
      // 冒泡flag
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
function appendAllChildren(parent: Instance, wip: FiberNode) {
  let node = wip.child;
  while (node !== null) {
    if (node.tag === HostComponent || node.tag === HostText) {
      // 如果是 HostComponent 或 HostText，将其 DOM 节点附加到父节点
      appendInitialChild(parent, node.stateNode);
    } else if (node.child !== null) {
      // 如果有子节点，递归处理
      node.child.return = node;
      node = node.child;
      continue;
    }
    if (node === wip) {
      return;
    }

    // 处理兄弟节点
    while (node.sibling === null) {
      if (node.return === null || node.return === wip) {
        return;
      }
      node = node.return;
    }
    node.sibling.return = node.return;
    node = node.sibling;
  }
}

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
