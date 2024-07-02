import { createRoot } from 'react-dom';

export function renderIntoDocument(element) {
  const div = document.createElement('div');
  // element
  return createRoot(div).render(element);
}
