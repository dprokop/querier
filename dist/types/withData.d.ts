import { DataDependenciesDescriptor, InferableComponentEnhancer } from './types';
export declare function withData<TProps, TInputQueries, TActionQueries>(dependencies: DataDependenciesDescriptor<TProps, TInputQueries, TActionQueries>): InferableComponentEnhancer<TProps, TInputQueries, TActionQueries>;
