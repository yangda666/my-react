import hasOwnProperty from '../../shared/hasOwnProperty';
import type { Type } from '../../shared/ReactTypes';
import type { FiberNode } from './fiber';

export type Container = any;

// export function createInstance(...args: any) {
//   return {} as any;
// }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function createInstance(type: Type, props = {}, _fiber: FiberNode) {
  // 创建一个新的 DOM 元素
  const domElement = document.createElement(type);

  // 初始化属性（例如 className、style、事件处理器等）
  for (const propKey in props) {
    if (hasOwnProperty.call(props, propKey)) {
      const propValue = props[propKey];
      if (propKey === 'children') {
        // 子元素将在稍后阶段处理
        continue;
      } else if (propKey === 'style') {
        // 处理样式
        for (const styleName in propValue) {
          if (hasOwnProperty.call(propValue, styleName)) {
            domElement.style[styleName] = propValue[styleName];
          }
        }
      } else if (propKey.startsWith('on')) {
        // 处理事件处理器
        const eventType = propKey.toLowerCase().substring(2);
        domElement.addEventListener(eventType, propValue);
      } else {
        // 处理其他属性
        domElement.setAttribute(propKey, propValue);
      }
    }
  }

  return domElement;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function appendChild(...args) {
  return {} as any;
}

export function createTextInstance(text: string) {
  return document.createTextNode(text);
}
