export type Container = Element;

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
};

export const appendChildToContainer = (
  child: Instance,
  container: Container
) => {
  container.appendChild(child);
};
