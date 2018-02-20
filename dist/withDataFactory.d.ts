import { WrappedActionQueries, WrappedInputQueries, InferableComponentEnhancer } from './types';
export declare const withDataFactory: <TProps, TInputQueries, TActionQueries>(queries: {
    inputQueries?: WrappedInputQueries<TProps, TInputQueries> | null | undefined;
    actionQueries?: WrappedActionQueries<TActionQueries> | undefined;
}) => InferableComponentEnhancer<TProps, TInputQueries, TActionQueries>;
