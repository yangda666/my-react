// export type TProps = any;

// export type TKey = any;
export type Type = any;
export type Key = any;
export type Ref = { current: unknown } | ((instance: unknown) => void);
export type Props = any;
export type ElementType = any;
export type ReactElementType = any;
export type ReactEmpty = null | void | boolean;

export type ReactFragment = ReactEmpty;

export type ReactNodeList = ReactEmpty;

export type ReactText = string | number;

export type Action<State> = State | ((preState: State) => State);
