// export type TProps = any;

// export type TKey = any;
export type Type = any;
export type Key = any;
export type Ref = { current: unknown } | ((instance: unknown) => void);
export type Props = any;
export type ElementType = any;

/**
 * Represents a JSX element.
 *
 * Where {@link ReactNode} represents everything that can be rendered, `ReactElement`
 * only represents JSX.
 *
 * @template P The type of the props object
 * @template T The type of the component or tag
 *
 * @example
 *
 * ```tsx
 * const element: ReactElement = <div />;
 * ```
 */
// export interface ReactElementType<P = any, T = string> {
//   type: T;
//   props: P;
//   key: string | null;
//   $$typeof: symbol | number;
// }

export interface ReactElementType {
  $$typeof: symbol | number;
  type: ElementType;
  key: Key;
  props: Props;
  ref: Ref;
  _owner: '_Yzj';
}

export type ReactEmpty = null | void | boolean;

export type ReactFragment = ReactEmpty;

export type ReactNodeList = ReactEmpty;

export type ReactText = string | number;

export type Action<State> = State | ((preState: State) => State);
