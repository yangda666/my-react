import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbol';
import type { Props, ReactElementType } from 'shared/ReactTypes';
import {
  createFiberFormElemnt,
  createWorkInProgress,
  FiberNode
} from './fiber';
import { ChildDeletion, Placement } from './fiberFlags';
import { HostText } from './workTags';

export type ExistingChildren = Map<string | number, FiberNode>;

function ChildRecociler(shouldTrackEffects: boolean) {
  // 删除剩下的fiber
  function deleteRemainingChildren(
    returnFiber: FiberNode,
    currentFirstChild: FiberNode | null
  ) {
    if (!shouldTrackEffects) {
      return;
    }
    // 需要删除的 节点
    let childToDelete = currentFirstChild;
    while (childToDelete !== null) {
      deleteChild(returnFiber, childToDelete);
      childToDelete = childToDelete.sibling;
    }
  }
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
    while (currentFiber !== null) {
      // update
      if (currentFiber.key === key) {
        // key 相同
        if (element.$$typeof === REACT_ELEMENT_TYPE) {
          if (currentFiber.type === element.type) {
            // type 相同
            const existing = useFiber(currentFiber, element.props);
            existing.return = returnFiber;
            // 当前节点可
            deleteRemainingChildren(returnFiber, currentFiber.sibling);
            return existing;
          }
          // type 不同 删除所有旧的节点
          deleteRemainingChildren(returnFiber, currentFiber);
          break;
        } else {
          if (__DEV__) {
            console.warn('还未实现的reconciler', element);
            break;
          }
        }
      } else {
        // key 不同
        deleteChild(returnFiber, currentFiber);
        currentFiber = currentFiber.sibling;
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
    while (currentFiber !== null) {
      // update
      if (currentFiber.tag === HostText) {
        const existing = useFiber(currentFiber, { content });
        existing.return = returnFiber;
        deleteRemainingChildren(returnFiber, currentFiber.sibling);
        return existing;
      }
      deleteChild(returnFiber, currentFiber);
      currentFiber = currentFiber.sibling;
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

  function updateFromMap(
    returnFiber: FiberNode,
    existingChildren: ExistingChildren,
    index: number,
    element: any
  ): FiberNode | null {
    let keyToUse;
    if (typeof element === 'string') {
      keyToUse = index;
    } else {
      keyToUse = element.key !== null ? element.key : index;
    }
    const before = existingChildren.get(keyToUse);

    if (typeof element === 'string') {
      if (before) {
        // fiber key相同，如果type也相同，则可复用
        existingChildren.delete(keyToUse);
        if (before.tag === HostText) {
          // 复用文本节点
          return useFiber(before, { content: element });
        } else {
          deleteChild(returnFiber, before);
        }
      }
      // 新建文本节点
      return new FiberNode(HostText, { content: element }, null);
    }
    if (typeof element === 'object' && element !== null) {
      switch (element.$$typeof) {
        case REACT_ELEMENT_TYPE:
          if (before) {
            // fiber key相同，如果type也相同，则可复用
            existingChildren.delete(keyToUse);
            if (before.type === element.type) {
              // 复用
              return useFiber(before, element.props);
            } else {
              deleteChild(returnFiber, before);
            }
          }
          return createFiberFormElemnt(element);
      }
    }
    console.error('updateFromMap未处理的情况', before, element);
    return null;
  }

  function reconcilerChildrenArray(
    returnFiber: FiberNode,
    currentFirstChild: FiberNode | null,
    newChild: any[]
  ) {
    // 最后一个可复用fiber在current中的index
    let lastPlacedIndex: number = 0;
    // 创建的最后一个fiber
    let lastNewFiber: FiberNode | null = null;
    // 创建的第一个fiber
    let firstNewFiber: FiberNode | null = null;

    // 1.将current保存在map中
    const existingChildren: ExistingChildren = new Map();
    let current = currentFirstChild;
    while (current !== null) {
      const keyToUse = current.key !== null ? current.key : current.index;
      existingChildren.set(keyToUse, current);
      current = current.sibling;
    }

    for (let i = 0; i < newChild.length; i++) {
      // 2.遍历newChild，寻找是否可复用
      const after = newChild[i];
      const newFiber = updateFromMap(returnFiber, existingChildren, i, after);

      if (newFiber === null) {
        continue;
      }

      // 3. 标记移动还是插入
      newFiber.index = i;
      newFiber.return = returnFiber;

      if (lastNewFiber === null) {
        lastNewFiber = newFiber;
        firstNewFiber = newFiber;
      } else {
        lastNewFiber.sibling = newFiber;
        lastNewFiber = lastNewFiber.sibling;
      }

      if (!shouldTrackEffects) {
        continue;
      }

      const current = newFiber.alternate;
      if (current !== null) {
        const oldIndex = current.index;
        if (oldIndex < lastPlacedIndex) {
          // 移动
          newFiber.flags |= Placement;
          continue;
        } else {
          // 不移动
          lastPlacedIndex = oldIndex;
        }
      } else {
        // mount
        newFiber.flags |= Placement;
      }
    }
    // 4. 将Map中剩下的标记为删除
    existingChildren.forEach((fiber) => {
      deleteChild(returnFiber, fiber);
    });
    return firstNewFiber;
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
      // 多节点的情况
      if (Array.isArray(newChild)) {
        return reconcilerChildrenArray(returnFiber, currentFiber, newChild);
      }
    }
    if (typeof newChild === 'string' || typeof newChild === 'number') {
      return placeSingleChild(
        renconcilerSingleTextNode(returnFiber, currentFiber, newChild)
      );
    }
    //兜底
    if (currentFiber !== null) {
      deleteRemainingChildren(returnFiber, currentFiber);
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
