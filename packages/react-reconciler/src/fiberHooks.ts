import type { FiberNode } from './fiber';

export function renderWithHook(wip: FiberNode) {
  const Component = wip.type;
  const props = wip.pendingProps;
  const children = Component(props);
  return children;
}
