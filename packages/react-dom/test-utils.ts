// @ts-ignore
import { createRoot } from 'react-dom';

export function renderIntoContainer(element) {
  const div = document.createElement('div');
  createRoot(div).render(element);
}
