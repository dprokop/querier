import { QuerierQueryDescriptor, QuerierState, QuerierStoreType, QuerierType } from './types';
import { Dispatch } from 'redux';
declare class Querier implements QuerierType {
    private store;
    private listeners;
    private logger;
    private reduxDispatch;
    constructor(store?: any, dispatch?: Dispatch<{}>);
    sendQuery<TResult>(queryDescriptor: QuerierQueryDescriptor<TResult>): Promise<void>;
    getStore(): QuerierStoreType;
    getEntry(key: string): {
        id: string;
        result: {} | null;
        state: {
            state: QuerierState;
            error?: {} | undefined;
        };
        $props: any;
        $reason: string | null;
    } | null;
    subscribe(queryKey: string, listener: Function): () => void;
    private notify(queryKey);
}
export default Querier;
export * from './types';
export * from './QuerierLogger';
export * from './QuerierProvider';
export * from './withData';
