import { Dispatch } from 'redux';

import { QuerierLogger } from './QuerierLogger';
import {
  QuerierQueryDescriptor,
  QuerierState,
  QuerierStoreType,
  QuerierType,
  QueryStateType,
  QuerierStateEntry
} from './types';
import { ResultActions } from '.';

export class NoDispatcherError extends Error {
  constructor() {
    super();
    this.name = 'NoDispatcherError';
    this.message = 'Cannot perform query effects. Querier initialised without dispatcher';
  }
}

export class Querier implements QuerierType {
  private store: QuerierStoreType;
  private listeners: Map<string, Array<Function>>;
  private logger: QuerierLogger = new QuerierLogger();
  private reduxDispatch: Dispatch<{}> | undefined;

  constructor(store?: QuerierStoreType, dispatch?: Dispatch<{}>) {
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

    let queryState: QuerierStoreType = {};

    if (this.tryServeFromCache(queryDescriptor)) {
      return;
    }

    this.startQuery(queryKey, props, queryDescriptor.reason);

    try {
      const result = await query();
      this.performQueryEffects(result, effects);
      this.successQuery(queryKey, result);
    } catch (e) {
      if (e.name === 'NoDispatcherError') {
        this.failQuery(queryKey, e);
        return Promise.reject(e);
      }
      this.failQuery(queryKey, e);
    }
  }

  performQueryEffects<TResult>(result: TResult, effects?: ResultActions<TResult> | null) {
    if (effects) {
      if (!this.reduxDispatch) {
        throw new NoDispatcherError();
      }

      this.logger.log('Performing query effects', { ...effects });
      const dispatch = this.reduxDispatch;
      effects.forEach(effect => {
        dispatch(effect(result));
      });
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
    this.listeners.set(queryKey, listeners ? [...listeners, listener] : [listener]);

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

  updateQuery<TResult>(key: string, update: Partial<QuerierStateEntry<TResult>>, silent?: boolean) {
    let queryState: QuerierStoreType = {};

    queryState[key] = {
      ...this.store[key],
      ...update
    };

    this.store = {
      ...this.store,
      ...queryState
    };

    if (!silent) {
      this.notify(key);
    }
  }

  startQuery(key: string, props?: {}, reason?: string) {
    this.updateQuery(key, {
      id: key,
      result: null,
      state: {
        state: QuerierState.Active
      },
      $props: props || null,
      $reason: reason
    });

    this.logger.log('Query started', { ...this.store[key] });
  }

  successQuery<TResult>(key: string, result: TResult) {
    this.updateQuery(key, {
      result,
      state: {
        state: QuerierState.Success
      }
    });
    this.logger.log('Query succeeded', { ...this.store[key] });
  }

  // tslint:disable-next-line
  failQuery(key: string, error: any) {
    this.updateQuery(key, {
      result: null,
      state: {
        state: QuerierState.Error,
        error
      }
    });

    this.logger.log('Query failed', { ...this.store[key] });
  }

  getListeners() {
    return this.listeners;
  }

  getListenersByKey(key: string) {
    return this.listeners.get(key);
  }

  private notify(queryKey: string) {
    const listeners = this.listeners.get(queryKey);
    if (listeners) {
      listeners.map(listener => listener(this.store[queryKey]));
    }
  }

  private tryServeFromCache<TResult>(queryDescriptor: QuerierQueryDescriptor<TResult>) {
    const { queryKey, hot } = queryDescriptor;
    const possibleQueryResult = this.store[queryKey];
    if (
      !!!hot &&
      possibleQueryResult &&
      (possibleQueryResult.result || possibleQueryResult.state.state === QuerierState.Active)
    ) {
      this.logger.log('Serving query from cache', possibleQueryResult);
      this.notify(queryKey);
      return true;
    }

    return false;
  }
}
