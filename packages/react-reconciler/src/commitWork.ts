import type { Container, Instance } from 'react-dom/src/hostConfig';
import {
  appendChildToContainer,
  commitUpdate,
  insertChildToContainer,
  removeChild
} from 'react-dom/src/hostConfig';
import type { FiberNode, FiberRootNode } from './fiber';
import {
  ChildDeletion,
  MutationMask,
  NoFlags,
  Placement,
  Update
} from './fiberFlags';
import {
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText
} from './workTags';

let nextEffect: FiberNode | null = null;
// 以DFS形式执行
export const commitMutationEffects = (finishedWork: FiberNode) => {
  nextEffect = finishedWork;
  while (nextEffect !== null) {
    // 向下遍历
    const child: FiberNode | null = nextEffect.child;
    if (
      (nextEffect.subtreeFlags & MutationMask) !== NoFlags &&
      child !== null
    ) {
      nextEffect = child;
    } else {
      // 向上遍历
      up: while (nextEffect !== null) {
        commitMutationEffectsOnFiber(nextEffect);
        const sibling: FiberNode | null = nextEffect.sibling;
        if (sibling !== null) {
          nextEffect = sibling;
          break up;
        }
        nextEffect = nextEffect.return;
      }
    }
  }
};

const commitMutationEffectsOnFiber = (finishedWork: FiberNode) => {
  const flags = finishedWork.flags;

  if ((flags & Placement) !== NoFlags) {
    // 插入/移动
    commitPlacement(finishedWork);
    finishedWork.flags &= ~Placement;
  }
  if ((flags & Update) !== NoFlags) {
    // 更新流程
    commitUpdate(finishedWork);
    finishedWork.flags &= ~Update;
  }
  if ((flags & ChildDeletion) !== NoFlags) {
    // 删除
    const deletions = finishedWork.deletions;
    if (deletions !== null) {
      deletions.forEach((deletion) => {
        commitDeletion(deletion);
      });
    }
    finishedWork.flags &= ~ChildDeletion;
  }
};

const commitPlacement = (finishedWork: FiberNode) => {
  if (__DEV__) {
    console.warn('commitPlacement', finishedWork);
  }
  // 父节点
  const hostParent = getHostParent(finishedWork) as FiberNode;
  // 找到兄弟节点
  const sibling = getHostSibling(finishedWork);
  let parentStateNode;
  switch (hostParent.tag) {
    case HostRoot:
      parentStateNode = (hostParent.stateNode as FiberRootNode).container;
      break;
    case HostComponent:
      parentStateNode = hostParent.stateNode;
  }

  // appendChild / insertBefore
  insertOrAppendPlacementNodeIntoContainer(
    finishedWork,
    parentStateNode,
    sibling
  );
};

function getHostSibling(fiber: FiberNode) {
  let node: FiberNode = fiber;
  findSibling: while (true) {
    // 向上遍历
    while (node.sibling === null) {
      const parent = node.return;
      if (
        parent === null ||
        parent.tag === HostComponent ||
        parent.tag === HostText
      ) {
        return null;
      }
      node = parent;
    }

    // 向下遍历的流程
    node.sibling.return = node.return;
    node = node.sibling;
    while (node.tag !== HostText && node.tag !== HostComponent) {
      // 向下遍历
      if ((node.flags & Placement) !== NoFlags) {
        continue findSibling;
      }
      if (node.child === null) {
        continue findSibling;
      } else {
        node.child.return = node;
        node = node.child;
      }
    }
    if ((node.flags & Placement) === NoFlags) {
      return node.stateNode;
    }
  }
}

const getHostParent = (fiber: FiberNode) => {
  let parent = fiber.return;
  while (parent) {
    const parentTag = parent.tag;
    if (parentTag === HostComponent || parentTag === HostRoot) {
      return parent;
    }
    parent = parent.return;
  }
  console.error('getHostParent未找到hostParent');
  return null;
};

// 插入到HostContainer
const insertOrAppendPlacementNodeIntoContainer = (
  finishedWork: FiberNode,
  hostParent: Container,
  before?: Instance
) => {
  if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
    if (before) {
      insertChildToContainer(finishedWork.stateNode, hostParent, before);
    } else {
      appendChildToContainer(finishedWork.stateNode, hostParent);
    }

    return;
  }
  const child = finishedWork.child;
  if (child !== null) {
    insertOrAppendPlacementNodeIntoContainer(child, hostParent);
    let sibling = child.sibling;
    while (sibling !== null) {
      insertOrAppendPlacementNodeIntoContainer(sibling, hostParent);
      sibling = sibling.sibling;
    }
  }
};
function commitDeletion(childToDelete: FiberNode) {
  let rootHostNode: FiberNode | null = null;

  // 递归子树
  commitNestedComponent(childToDelete, (unmountFiber) => {
    switch (unmountFiber.tag) {
      case HostComponent:
        if (rootHostNode === null) {
          rootHostNode = unmountFiber;
        }
        // TODO 解绑ref
        return;
      case HostText:
        if (rootHostNode === null) {
          rootHostNode = unmountFiber;
        }
        return;
      case FunctionComponent:
        // TODO useEffect unmount 、解绑ref
        return;
      default:
        if (__DEV__) {
          console.warn('未处理的unmount类型', unmountFiber);
        }
    }
  });

  // 移除rootHostComponent的DOM
  if (rootHostNode !== null) {
    const hostParent = getHostParent(childToDelete);
    if (hostParent !== null) {
      removeChild((rootHostNode as FiberNode).stateNode, hostParent.stateNode);
    }
  }
  childToDelete.return = null;
  childToDelete.child = null;
}

function commitNestedComponent(
  root: FiberNode,
  onCommitUnmount: (fiber: FiberNode) => void
) {
  let node = root;
  while (true) {
    onCommitUnmount(node);

    if (node.child !== null) {
      // 向下遍历
      node.child.return = node;
      node = node.child;
      continue;
    }
    if (node === root) {
      // 终止条件
      return;
    }
    while (node.sibling === null) {
      if (node.return === null || node.return === root) {
        return;
      }
      // 向上归
      node = node.return;
    }
    node.sibling.return = node.return;
    node = node.sibling;
  }
}
