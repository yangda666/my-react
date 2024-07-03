import { FiberNode } from '../../react-reconciler/src/fiber';
import { HostText } from '../../react-reconciler/src/workTags';

export type Container = Element;
export type TextInstance = Text;
export type Instance = Element;
// export function createInstance(...args: any) {
//   return {} as any;
// }

export const createInstance = (type: string) => {
  // document.createElement
  return document.createElement(type);
};

export const createTextInstance = (content: string) => {
  // document.createTextNode
  return document.createTextNode(content);
};

export const appendInitialChild = (parent: Instance, child: Instance) => {
  parent.appendChild(child);
  if (__DEV__) {
    console.warn('parent', parent);
  }
};

export const appendChildToContainer = (
  child: Instance,
  container: Container
) => {
  container.appendChild(child);
};

export const commitUpdate = (fiber: FiberNode) => {
  switch (fiber.tag) {
    case HostText: {
      const text = fiber.pendingProps.content;
      return commitTextUpdate(fiber.stateNode, text);
    }
    default:
      if (__DEV__) {
        console.warn('未实现的CommitUpdate类型', fiber);
      }
      break;
  }
};
export const commitTextUpdate = (instance: TextInstance, text: string) => {
  instance.textContent = text;
};

export function removeChild(
  child: Instance | TextInstance,
  container: Container
) {
  container.removeChild(child);
}
