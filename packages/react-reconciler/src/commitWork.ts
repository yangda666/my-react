import type { Container } from '../../react-dom/src/hostConfig';
import { appendChildToContainer } from '../../react-dom/src/hostConfig';
import type { FiberNode, FiberRootNode } from './fiber';
import { MutationMask, NoFlags, Placement } from './fiberFlags';
import { HostComponent, HostRoot, HostText } from './workTags';

let nexEffect: FiberNode | null = null;
export const commitMutationEffects = (finishedWork: FiberNode) => {
  nexEffect = finishedWork;
  while (nexEffect !== null) {
    // 向下便利
    const child = nexEffect.child;
    if ((nexEffect.subtreeFlags & MutationMask) !== NoFlags && child !== null) {
      // 说明子节点还有存在变异 所以向下便利
      // nexEffect.child;
      nexEffect = child;
    } else {
      // 找到最后一个需要变异的节点
      up: while (nexEffect !== null) {
        commitMutationEffectsOnFiber(nexEffect);
        // 子节点
        const sibling = nexEffect.sibling;
        if (sibling !== null) {
          nexEffect = sibling;
          break up;
        }
        nexEffect = nexEffect.return;
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
};

const commitPlacement = (finishedWork: FiberNode) => {
  if (__DEV__) {
    console.warn('commitPlacement', finishedWork);
  }
  const hostParent = getHostParent(finishedWork) as FiberNode;
  let parentStateNode;
  switch (hostParent.tag) {
    case HostRoot:
      parentStateNode = (hostParent.stateNode as FiberRootNode).container;
      break;
    case HostComponent:
      parentStateNode = hostParent.stateNode;
  }

  // appendChild / insertBefore
  appendPlacementNodeIntoContainer(finishedWork, parentStateNode);
};

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
const appendPlacementNodeIntoContainer = (
  finishedWork: FiberNode,
  hostParent: Container
) => {
  if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
    appendChildToContainer(finishedWork.stateNode, hostParent);
    return;
  }
  const child = finishedWork.child;
  if (child !== null) {
    appendPlacementNodeIntoContainer(child, hostParent);
    let sibling = child.sibling;
    while (sibling !== null) {
      appendPlacementNodeIntoContainer(sibling, hostParent);
      sibling = sibling.sibling;
    }
  }
};
