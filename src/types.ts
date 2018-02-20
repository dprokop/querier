// tslint:disable:no-any
import { Action, ActionFunction1 } from 'redux-actions';
import { ComponentClass, ComponentType } from 'react';

// Diff / Omit taken from https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-311923766
export type Diff<T extends string, U extends string> = ({ [P in T]: P } &
  { [P in U]: never } & { [x: string]: never })[T];
export type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

export type InputQuery<TProps, TResult> = (props: TProps) => Promise<TResult>;
export type ActionQuery<TResult> = (...args: any[]) => Promise<TResult>;

export type ResultActions<T> = Array<ActionFunction1<T, Action<T>>>;

export type InputQueriesDescriptor<TProps, TInputQueries> = {
  [TProp in keyof TInputQueries]: {
    query: InputQuery<TProps, TInputQueries[TProp]>;
    resultActions?: ResultActions<TInputQueries[TProp]>;
    hot?: boolean;
    $result?: TInputQueries[TProp];
  }
};

export type ActionQueriesDescriptor<TActionQueries> = {
  [TProp in keyof TActionQueries]: {
    query: ActionQuery<TActionQueries[TProp]>;
    resultActions?: ResultActions<TActionQueries[TProp]>;
    hot?: boolean;
    $result?: TActionQueries[TProp];
  }
};

export type DataDependenciesDescriptor<
  TProps,
  TInputQueries,
  TActionQueries
> = {
  inputQueries?: InputQueriesDescriptor<TProps, TInputQueries>;
  actionQueries?: ActionQueriesDescriptor<TActionQueries>;
};

export type WrappedInputQueries<TProps, TInputQueries> = {
  [TProp in keyof TInputQueries]: {
    query: InputQuery<TProps, TInputQueries[TProp]>;
    resultActions?: ResultActions<TInputQueries[TProp]>;
    hot: boolean;
    key: string;
  }
};

export type WrappedActionQueries<TActionQueries> = {
  [TProp in keyof TActionQueries]: {
    query: ActionQuery<TActionQueries[TProp]>;
    resultActions?: ResultActions<TActionQueries[TProp]>;
    hot: boolean;
    key: string;
  }
};

export type InputQueriesResults<TInputQueries> = {
  [TProp in keyof TInputQueries]: TInputQueries[TProp] | null
};

export type ActionQueriesProps<TActionQueries> = {
  [TProp in keyof TActionQueries]: (
    ...args: any[]
  ) => Promise<TActionQueries[TProp]>
};

export type InjectedStates<TInputQueries, TActionQueries> = {
  [P in keyof TActionQueries]: QueryStateType
} &
  { [P in keyof TInputQueries]: QueryStateType };

export type InjectedResults<
  TInputQueries,
  TActionQueries
> = InputQueriesResults<TInputQueries> & InputQueriesResults<TActionQueries>;

export type WithDataProps<TProps, TInputQueries, TActionQueries> = {
  [P in keyof TProps]: TProps[P]
} & {
  results: InjectedResults<TInputQueries, TActionQueries>;
  actionQueries: ActionQueriesProps<TActionQueries>;
  states: InjectedStates<TInputQueries, TActionQueries>;
};

// Inspired by react-redux
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-redux/index.d.ts#L47
export interface InferableComponentEnhancer<
  TProps,
  TInputQueries,
  TActionQueries
> {
  (
    component: ComponentType<
      WithDataProps<TProps, TInputQueries, TActionQueries>
    >
  ): ComponentClass<TProps>;
}

// Querier specific types
export type QuerierQuery<TResult> = () => Promise<TResult>;

export type QuerierQueryDescriptor<TResult> = {
  query: QuerierQuery<TResult>;
  queryKey: string;
  hot?: boolean;
  props?: {};
  effects?: ResultActions<TResult>;
  reason?: string;
};

export enum QuerierState {
  Pending = 0,
  Active,
  Success,
  Error
}

export type QueryStateType = {
  state: QuerierState;
  error?: {};
};

export type QuerierStateEntry<TResult> = {
  id: string;
  result: TResult | null;
  state: QueryStateType;
  // tslint:disable-next-line
  $props: any;
  $reason: string | null;
};

export type QuerierStoreType = {
  [key: string]: QuerierStateEntry<{}>;
};

export interface QuerierType {
  sendQuery: <T>(queryDescriptor: QuerierQueryDescriptor<T>) => void;
  subscribe: (queryKey: string, listener: Function) => () => void;
  getStore: () => QuerierStoreType;
  getEntry: (key: string) => QuerierStateEntry<{}> | null;
}

export type StatesType = {
  [key: string]: QueryStateType;
};
