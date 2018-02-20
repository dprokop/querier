import { DataDependenciesDescriptor, InferableComponentEnhancer } from './types';
declare function withData<TProps, TInputQueries, TActionQueries>(dependencies: DataDependenciesDescriptor<TProps, TInputQueries, TActionQueries>): InferableComponentEnhancer<TProps, TInputQueries, TActionQueries>;
export default withData;
