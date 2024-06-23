import { REACT_ELEMENT_TYPE } from '../../shared/ReactSymbol';
import type { ReactElementType } from '../../shared/ReactTypes';
import { createFiberFormElemnt, FiberNode } from './fiber';
import { Placement } from './fiberFlags';
import { HostText } from './workTags';

function ChildRecociler(shouldTrackEffects: boolean) {
  function reconcilerSingleElement(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    element: ReactElementType
  ) {
    const fiber = createFiberFormElemnt(element);
    fiber.return = returnFiber;
    return fiber;
  }

  function renconcileSingleTextNode(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    content: string | number
  ) {
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
        renconcileSingleTextNode(returnFiber, currentFiber, newChild)
      );
    }
    if (__DEV__) {
      console.warn('未实现reconcile类型', newChild);
    }
    return null;
  };
}

export const reconcileChildFibers = ChildRecociler(true);
export const mountChildFiber = ChildRecociler(false);
