import type { FiberNode } from './fiber';
import { NoFlags } from './fiberFlags';
import { createInstance, createTextInstance } from './hostConfig';
import { HostComponent, HostRoot, HostText } from './workTags';

export const completeWork = (wip: FiberNode) => {
  const newProps = wip.pendingProps;
  const current = wip.alternate;
  switch (wip.tag) {
    case HostComponent:
      if (current !== null && wip.stateNode) {
        return null;
      } else {
        // 构建 Dom
        // 将dom插入到Dom树中
        const type = wip.type;
        const instance = createInstance(type, newProps, wip);
        appendAllChildren(instance, wip);
        // finalizeInitialChildren(instance, type, newProps);
        wip.stateNode = instance;
      }
      bubbleProperties(wip);
      return null;
    case HostRoot:
      bubbleProperties(wip);
      return null;
    case HostText:
      if (current === null) {
        // 初次渲染，创建新的文本节点
        wip.stateNode = createTextInstance(newProps.content /* other args */);
      } else {
        // 更新现有的文本节点
        // const oldText = current.memoizedProps;
        // if (oldText !== newText) {
        //   markUpdate(workInProgress);
        // }
      }
      bubbleProperties(wip);
      return null;

    default:
      if (__DEV__) {
        console.warn('未出处理的complete情况', wip);
      }
      bubbleProperties(wip);
      return null;
  }
};

function appendAllChildren(parent: any, wip: FiberNode) {
  let node = wip.child;

  while (node !== null) {
    if (node.tag === HostComponent || node.tag === HostText) {
      // 如果是 HostComponent 或 HostText，将其 DOM 节点附加到父节点
      parent.appendChild(node.stateNode);
    } else if (node.child !== null) {
      // 如果有子节点，递归处理
      node = node.child;
      continue;
    }
    // 处理兄弟节点
    while (node.sibling === null && node !== wip) {
      node = node.return;
    }
    node = node.sibling;
  }
}

function bubbleProperties(completedWork: FiberNode) {
  let subtreeFlags = NoFlags;
  let child = completedWork.child;
  while (child !== null) {
    subtreeFlags |= child.subtreeFlags;
    subtreeFlags |= child.flags;
    child = child.sibling;
  }
  completedWork.subtreeFlags |= subtreeFlags;
}
