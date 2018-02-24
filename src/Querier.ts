import { Dispatch } from 'redux';

import { QuerierLogger } from './QuerierLogger';
import { QuerierQueryDescriptor, QuerierState, QuerierStoreType, QuerierType } from './types';

export class Querier implements QuerierType {
  private store: QuerierStoreType;
  private listeners: Map<string, Array<Function>>;
  private logger: QuerierLogger = new QuerierLogger();
  private reduxDispatch: Dispatch<{}> | undefined;

  // tslint:disable-next-line
  constructor(store?: any, dispatch?: Dispatch<{}>) {
    this.store = store || {};
    this.listeners = new Map();
    this.reduxDispatch = dispatch;

    this.sendQuery = this.sendQuery.bind(this);
    this.notify = this.notify.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.getEntry = this.getEntry.bind(this);
  }

  async sendQuery<TResult>(queryDescriptor: QuerierQueryDescriptor<TResult>) {
    const { query, queryKey, effects, hot, props } = queryDescriptor;
    const possibleQueryResult = this.store[queryKey];
    if (
      !!!hot &&
      possibleQueryResult &&
      (possibleQueryResult.result ||
        possibleQueryResult.state.state === QuerierState.Active)
    ) {
      this.logger.log('Serving query from cache', possibleQueryResult);
      this.notify(queryKey);
      return;
    }

    let queryState: QuerierStoreType = {};

    queryState[queryKey] = {
      id: queryKey,
      result: null,

      state: {
        state: QuerierState.Active
      },
      $props: props,
      $reason: queryDescriptor.reason || null
    };

    this.store = {
      ...this.store,
      ...queryState
    };

    this.notify(queryKey);

    try {
      this.logger.log('Sending query', { ...queryState[queryKey] });
      const result = await query();
      queryState[queryKey] = {
        ...queryState[queryKey],
        result,
        state: {
          state: QuerierState.Success
        }
      };

      this.store = {
        ...this.store,
        ...queryState
      };

      this.logger.log('Query succeeded', { ...queryState[queryKey] });

      if (effects && this.reduxDispatch) {
        this.logger.log('Performing query effects', { ...effects });
        const dispatch = this.reduxDispatch;
        effects.forEach(effect => {
          dispatch(effect(result));
        });
      }

      this.notify(queryKey);
    } catch (e) {
      queryState[queryKey] = {
        ...queryState[queryKey],
        result: null,
        state: {
          state: QuerierState.Error,
          error: e
        }
      };
      this.store = {
        ...this.store,
        ...queryState
      };
      this.logger.log('Query failed', { ...queryState[queryKey] });
      this.notify(queryKey);
    }
  }

  getStore() {
    return this.store;
  }

  getEntry(key: string) {
    if (this.getStore()[key]) {
      return this.getStore()[key];
    }
    return null;
  }

  subscribe(queryKey: string, listener: Function) {
    // TODO: add typings
    const listeners = this.listeners.get(queryKey);
    this.listeners.set(
      queryKey,
      listeners ? [...listeners, listener] : [listener]
    );

    return () => {
      const _listeners = this.listeners.get(queryKey);
      if (_listeners) {
        const index = _listeners.indexOf(listener);
        this.listeners.set(queryKey, [
          ..._listeners.slice(0, index),
          ..._listeners.slice(index + 1, _listeners.length)
        ]);
      }
    };
  }

  private notify(queryKey: string) {
    const listeners = this.listeners.get(queryKey);
    if (listeners) {
      listeners.map(listener => listener(this.store[queryKey]));
    }
  }
}
