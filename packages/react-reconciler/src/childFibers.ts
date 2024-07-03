import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbol';
import type { Props, ReactElementType } from 'shared/ReactTypes';
import {
  createFiberFormElemnt,
  createWorkInProgress,
  FiberNode
} from './fiber';
import { ChildDeletion, Placement } from './fiberFlags';
import { HostText } from './workTags';

function ChildRecociler(shouldTrackEffects: boolean) {
  // 删除子节点
  function deleteChild(returnFiber: FiberNode, childToDelete: FiberNode) {
    if (!shouldTrackEffects) {
      return;
    }
    const deletions = returnFiber.deletions;

    if (deletions == null) {
      // 父节点还没有要删除 fiber
      returnFiber.deletions = [childToDelete];
      returnFiber.flags |= ChildDeletion;
    } else {
      // 父节点中已经有要删除的数据
      deletions.push(childToDelete);
    }
  }
  function reconcilerSingleElement(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    element: ReactElementType
  ) {
    // 1. 查看是否可以复用fiber currentFiber 与 wip 的fiber 做对比
    const key = element.key;
    work: if (currentFiber !== null) {
      // update
      if (currentFiber.key === key) {
        // key 相同
        if (element.$$typeof === REACT_ELEMENT_TYPE) {
          // type 相同
          if (currentFiber.type === element.type) {
            const existing = useFiber(currentFiber, element.props);
            existing.return = returnFiber;
            return existing;
          }
          deleteChild(returnFiber, currentFiber);
          break work;
        } else {
          if (__DEV__) {
            console.warn('还未实现的reconciler', element);
          }
        }
      } else {
        deleteChild(returnFiber, currentFiber);
      }
    }
    // 创建fiber
    const fiber = createFiberFormElemnt(element);
    fiber.return = returnFiber;
    return fiber;
  }

  function renconcilerSingleTextNode(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    content: string | number
  ) {
    if (currentFiber !== null) {
      // update
      if (currentFiber.tag === HostText) {
        const existing = useFiber(currentFiber, { content });
        existing.return = returnFiber;
        return existing;
      }
      deleteChild(returnFiber, currentFiber);
    }
    const fiber = new FiberNode(HostText, { content }, null);
    fiber.return = returnFiber;
    return fiber;
  }

  function placeSingleChild(fiber: FiberNode) {
    if (shouldTrackEffects && fiber.alternate === null) {
      fiber.flags |= Placement;
    }
    return fiber;
  }

  return function reconcilerChildFibers(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    newChild?: ReactElementType
  ) {
    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcilerSingleElement(returnFiber, currentFiber, newChild)
          );
        default:
          if (__DEV__) {
            console.warn('未实现的reconcile类型', newChild);
          }
          break;
      }
    }
    if (typeof newChild === 'string' || typeof newChild === 'number') {
      return placeSingleChild(
        renconcilerSingleTextNode(returnFiber, currentFiber, newChild)
      );
    }
    //兜底
    if (currentFiber !== null) {
      deleteChild(returnFiber, currentFiber);
    }
    if (__DEV__) {
      console.warn('未实现reconcile类型', newChild);
    }
    return null;
  };
}

function useFiber(fier: FiberNode, pendingProps: Props) {
  const clone = createWorkInProgress(fier, pendingProps);
  clone.index = 0;
  clone.sibling = null;
  return clone;
}

export const reconcileChildFibers = ChildRecociler(true);
export const mountChildFiber = ChildRecociler(false);
