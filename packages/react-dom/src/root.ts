// ReactDOM.createRoot(root).render(<App/>)

import {
  createContainer,
  updateContainer
} from '../../react-reconciler/src/fiberReconciler';
import type { ReactElementType } from '../../shared/ReactTypes';
import type { Container } from './hostConfig';
import { initEvent } from './SyntheticEvent';

export function createRoot(container: Container) {
  const root = createContainer(container);
  return {
    render(element: ReactElementType) {
      initEvent(container, 'click');
      console.log('开始render');
      return updateContainer(element, root);
    }
  };
}
