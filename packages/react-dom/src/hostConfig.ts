import hasOwnProperty from '../../shared/hasOwnProperty';

export type Container = Element;

export type Instance = Element;
// export function createInstance(...args: any) {
//   return {} as any;
// }

export function createInstance(type: string, props = {}): Instance {
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

export function appendChild(parent: Instance | Container, child: Instance) {
  parent.appendChild(child);
}

export function createTextInstance(text: string) {
  return document.createTextNode(text);
}

export const appendChildToContainer = appendChild;
