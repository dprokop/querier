/// <reference types="react" />
import { Action, ActionFunction1 } from 'redux-actions';
import { ComponentClass, ComponentType } from 'react';
export declare type Diff<T extends string, U extends string> = ({
    [P in T]: P;
} & {
    [P in U]: never;
} & {
    [x: string]: never;
})[T];
export declare type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;
export declare type InputQuery<TProps, TResult> = (props: TProps) => Promise<TResult>;
export declare type ActionQuery<TResult> = (...args: any[]) => Promise<TResult>;
export declare type ResultActions<T> = Array<ActionFunction1<T, Action<T>>>;
export declare type InputQueriesDescriptor<TProps, TInputQueries> = {
    [TProp in keyof TInputQueries]: {
        query: InputQuery<TProps, TInputQueries[TProp]>;
        resultActions?: ResultActions<TInputQueries[TProp]>;
        hot?: boolean;
        $result?: TInputQueries[TProp];
    };
};
export declare type ActionQueriesDescriptor<TActionQueries> = {
    [TProp in keyof TActionQueries]: {
        query: ActionQuery<TActionQueries[TProp]>;
        resultActions?: ResultActions<TActionQueries[TProp]>;
        hot?: boolean;
        $result?: TActionQueries[TProp];
    };
};
export declare type DataDependenciesDescriptor<TProps, TInputQueries, TActionQueries> = {
    inputQueries?: InputQueriesDescriptor<TProps, TInputQueries>;
    actionQueries?: ActionQueriesDescriptor<TActionQueries>;
};
export declare type WrappedInputQueries<TProps, TInputQueries> = {
    [TProp in keyof TInputQueries]: {
        query: InputQuery<TProps, TInputQueries[TProp]>;
        resultActions?: ResultActions<TInputQueries[TProp]>;
        hot: boolean;
        key: string;
    };
};
export declare type WrappedActionQueries<TActionQueries> = {
    [TProp in keyof TActionQueries]: {
        query: ActionQuery<TActionQueries[TProp]>;
        resultActions?: ResultActions<TActionQueries[TProp]>;
        hot: boolean;
        key: string;
    };
};
export declare type InputQueriesResults<TInputQueries> = {
    [TProp in keyof TInputQueries]: TInputQueries[TProp] | null;
};
export declare type ActionQueriesProps<TActionQueries> = {
    [TProp in keyof TActionQueries]: (...args: any[]) => Promise<TActionQueries[TProp]>;
};
export declare type InjectedStates<TInputQueries, TActionQueries> = {
    [P in keyof TActionQueries]: QueryStateType;
} & {
    [P in keyof TInputQueries]: QueryStateType;
};
export declare type InjectedResults<TInputQueries, TActionQueries> = InputQueriesResults<TInputQueries> & InputQueriesResults<TActionQueries>;
export declare type WithDataProps<TProps, TInputQueries, TActionQueries> = {
    [P in keyof TProps]: TProps[P];
} & {
    results: InjectedResults<TInputQueries, TActionQueries>;
    actionQueries: ActionQueriesProps<TActionQueries>;
    states: InjectedStates<TInputQueries, TActionQueries>;
};
export interface InferableComponentEnhancer<TProps, TInputQueries, TActionQueries> {
    (component: ComponentType<WithDataProps<TProps, TInputQueries, TActionQueries>>): ComponentClass<TProps>;
}
export declare type QuerierQuery<TResult> = () => Promise<TResult>;
export declare type QuerierQueryDescriptor<TResult> = {
    query: QuerierQuery<TResult>;
    queryKey: string;
    hot?: boolean;
    props?: {};
    effects?: ResultActions<TResult>;
    reason?: string;
};
export declare enum QuerierState {
    Pending = 0,
    Active = 1,
    Success = 2,
    Error = 3,
}
export declare type QueryStateType = {
    state: QuerierState;
    error?: {};
};
export declare type QuerierStateEntry<TResult> = {
    id: string;
    result: TResult | null;
    state: QueryStateType;
    $props: any;
    $reason: string | null;
};
export declare type QuerierStoreType = {
    [key: string]: QuerierStateEntry<{}>;
};
export interface QuerierType {
    sendQuery: <T>(queryDescriptor: QuerierQueryDescriptor<T>) => void;
    subscribe: (queryKey: string, listener: Function) => () => void;
    getStore: () => QuerierStoreType;
    getEntry: (key: string) => QuerierStateEntry<{}> | null;
}
export declare type StatesType = {
    [key: string]: QueryStateType;
};
