// import { Container } from 'react-dom';
import { Container } from 'hostConfig';
import { Props } from 'shared/ReactTypes';

export const elementPropsKey = '__props';
export type EventCallback = (e: Event) => void;
interface SyntheticEvent extends Event {
  __stopPropagation: boolean;
}
export type Paths = {
  bubble: EventCallback[];
  capture: EventCallback[];
};

const validEventTypeList = ['click'];
export interface DOMElement extends Element {
  [elementPropsKey]: Props;
}

// 创建合成事件
function createSynthticEvent(e: Event) {
  const syntheticEvent = e as SyntheticEvent;
  syntheticEvent.__stopPropagation = false;
  const originStopPropagation = e.stopPropagation;
  syntheticEvent.stopPropagation = () => {
    syntheticEvent.__stopPropagation = true;
    if (originStopPropagation) {
      originStopPropagation();
    }
  };
  return syntheticEvent;
}

export function updateFiberProps(node: DOMElement, props: Props) {
  node[elementPropsKey] = props;
}

export function initEvent(container: Container, eventType: string) {
  if (!validEventTypeList.includes(eventType)) {
    console.warn('当前不支持的事件类型', eventType);
    return;
  }
  if (__DEV__) {
    console.log('初始化事件');
  }
  container.addEventListener(eventType, (e) => {
    dispatchEvent(container, eventType, e);
  });
}

function dispatchEvent(container: Container, eventType: string, e: Event) {
  // 收集沿途的事件
  const targetElement = e.target;
  if (targetElement === null) {
    console.warn('事件不纯在target');
    return;
  }

  const { bubble, capture } = collectPaths(
    targetElement as DOMElement,
    container,
    eventType
  );
  // 构造合成事件
  const se = createSynthticEvent(e);
  // 遍历capture
  triggerEventFlow(capture, se);
  if (!se.__stopPropagation) {
    // 4. 遍历bubble
    triggerEventFlow(bubble, se);
  }
}
function triggerEventFlow(paths: EventCallback[], se: SyntheticEvent) {
  for (let i = 0; i < paths.length; i++) {
    const callback = paths[i];
    callback.call(null, se);

    if (se.__stopPropagation) {
      break;
    }
  }
}
function collectPaths(
  targetElement: DOMElement,
  container: Container,
  eventType: string
) {
  const paths: Paths = {
    capture: [],
    bubble: []
  };
  while (targetElement && targetElement !== container) {
    const elementProps = targetElement[elementPropsKey];
    if (elementProps) {
      const callBackNameList = getEventCallbackNameFromEventType(eventType);
      if (callBackNameList) {
        callBackNameList.forEach((calllBackName, i) => {
          const enventCallback = elementProps[calllBackName];
          if (enventCallback) {
            if (i === 0) {
              // 如果为capture
              paths.capture.unshift(enventCallback);
            } else {
              paths.bubble.push(enventCallback);
            }
          }
        });
      }
    }
    targetElement = targetElement.parentNode as DOMElement;
  }
  return paths;
}

function getEventCallbackNameFromEventType(
  eventType: string
): string[] | undefined {
  return {
    click: ['onClickCapture', 'onClick']
  }[eventType];
}
