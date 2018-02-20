import { InputQueriesDescriptor, WrappedInputQueries, ActionQueriesDescriptor, WrappedActionQueries } from '../types';
export declare const inputQueryDescriptorsBuilder: <TProps, TInputQueries>(inputQueries: InputQueriesDescriptor<TProps, TInputQueries>) => WrappedInputQueries<TProps, TInputQueries>;
export declare const actionQueryDescriptorsBuilder: <TActionQueries>(actionQueries: ActionQueriesDescriptor<TActionQueries>) => WrappedActionQueries<TActionQueries>;
