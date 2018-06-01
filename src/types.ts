// tslint:disable:no-any
import { ComponentClass, ComponentType } from 'react';

// Diff / Omit taken from https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-311923766
export type Diff<T extends string, U extends string> = ({ [P in T]: P } &
  { [P in U]: never } & { [x: string]: never })[T];
export type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

export type InputQuery<TProps, TResult> = (props: TProps) => Promise<TResult>;
export type ActionQuery<TResult> = (...args: any[]) => Promise<TResult>;

// Taken from redux-actions
export interface BaseAction {
  type: string;
}

// Taken from redux-actions
export interface Action<Payload> extends BaseAction {
  payload?: Payload;
  error?: boolean;
}

// Taken from redux-actions
export type ActionFunction1<T1, R> = (t1: T1) => R;

export type ResultActions<T> = Array<ActionFunction1<T, Action<T>>>;

export type InputQueryDefinition<TProps, TResult> = {
  query: InputQuery<TProps, TResult>;
  resultActions?: ResultActions<TResult>;
  hot?: boolean;
  lazy?: boolean;
  $result?: TResult;
};

export type InputQueriesDefinition<TProps, TInputQueries> = {
  [TProp in keyof TInputQueries]: InputQueryDefinition<TProps, TInputQueries[TProp]>
};

export type ActionQueriesDefinition<TActionQueries> = {
  [TProp in keyof TActionQueries]: {
    query: ActionQuery<TActionQueries[TProp]>;
    resultActions?: ResultActions<TActionQueries[TProp]>;
    hot?: boolean;
    $result?: TActionQueries[TProp];
  }
};

export type DataDependencyDefinition<TProps, TInputQueries, TActionQueries> = {
  inputQueries?: InputQueriesDefinition<TProps, TInputQueries>;
  actionQueries?: ActionQueriesDefinition<TActionQueries>;
};

export type WrappedInputQueries<TProps, TInputQueries> = {
  [TProp in keyof TInputQueries]: {
    query: InputQuery<TProps, TInputQueries[TProp]>;
    resultActions: ResultActions<TInputQueries[TProp]> | null;
    hot: boolean;
    lazy: boolean;
    key: string;
  }
};

export type WrappedActionQueries<TActionQueries> = {
  [TProp in keyof TActionQueries]: {
    query: ActionQuery<TActionQueries[TProp]>;
    resultActions?: ResultActions<TActionQueries[TProp]> | null;
    hot: boolean;
    key: string;
  }
};

export type InputQueriesResults<TInputQueries> = {
  [TProp in keyof TInputQueries]: TInputQueries[TProp] | null
};

export type InputQueriesProps<TInputQueries> = {
  [TProp in keyof TInputQueries]: {
    isLazy?: boolean;
    fire: () => void;
  }
};

export type ActionQueriesProps<TActionQueries> = {
  [TProp in keyof TActionQueries]: (...args: any[]) => Promise<TActionQueries[TProp]>
};

export type InjectedStates<TInputQueries, TActionQueries> = {
  [P in keyof TActionQueries]: QueryStateType | null
} &
  { [P in keyof TInputQueries]: QueryStateType | null };

export type InputQueryExecutor = {
  isLazy: boolean;
  fire: () => void;
};

export type InjectedResults<TInputQueries, TActionQueries> = InputQueriesResults<TInputQueries> &
  InputQueriesResults<TActionQueries>;

export type WithDataProps<TProps, TInputQueries, TActionQueries> = {
  [P in keyof TProps]: TProps[P]
} & {
  results: InjectedResults<TInputQueries, TActionQueries>;
  actionQueries: ActionQueriesProps<TActionQueries>;
  inputQueries: InputQueriesProps<TInputQueries>;
  states: InjectedStates<TInputQueries, TActionQueries>;
};

// Inspired by react-redux
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-redux/index.d.ts#L47
export interface InferableComponentEnhancer<TProps, TInputQueries, TActionQueries> {
  (component: ComponentType<WithDataProps<TProps, TInputQueries, TActionQueries>>): ComponentClass<
    TProps
  >;
}

// Querier specific types
export type QuerierQuery<TResult> = () => Promise<TResult>;

export type QuerierQueryDescriptor<TResult> = {
  query: QuerierQuery<TResult>;
  queryKey: string;
  hot?: boolean;
  props?: {};
  effects?: ResultActions<TResult> | null;
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
