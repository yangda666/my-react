import { FiberNode } from 'react-reconciler/src/fiber';
import { HostComponent, HostText } from 'react-reconciler/src/workTags';
import { Props } from 'shared/ReactTypes';
import { DOMElement, updateFiberProps } from './SyntheticEvent';

export type Container = Element;
export type TextInstance = Text;
export type Instance = Element;
// export function createInstance(...args: any) {
//   return {} as any;
// }

export const createInstance = (type: string, props: Props) => {
  // document.createElement
  const element = document.createElement(type) as unknown;
  // 给 dom 绑定属性
  updateFiberProps(element as DOMElement, props);
  return element as Element;
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
    case HostComponent: {
      // updateFiberProps()
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
