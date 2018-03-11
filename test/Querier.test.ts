import { Querier, NoDispatcherError } from '../src/Querier';
import { QuerierStoreType, QuerierState, QuerierStateEntry } from '../src';
import request, { users } from './__mocks__/request';

const mockQuerier = (store?: QuerierStoreType) => {
  return new Querier(store);
};

const failQuery = async () => {
  return await request('/users/3');
};

const successQuery = async () => {
  const res = await request('/users/1');
  return res;
};

const queryKey = 'key';
const queryResult = users[1];
const queryReason = 'SomeComponent';

const createStoreMock = (
  state: { state: QuerierState } = { state: QuerierState.Success },
  // tslint:disable-next-line
  $props: any = null,
  id: string = queryKey,
  result: { name: string } = queryResult,
  $reason: string = queryReason
): QuerierStoreType => {
  return { key: { id, result, state, $props, $reason } };
};
const storeMock: QuerierStoreType = createStoreMock({ state: QuerierState.Active }, null, null);

describe('Querier', () => {
  describe('utilities', () => {
    test('getEntry', () => {
      const querier = new Querier(storeMock);

      expect(Object.keys(querier.getStore())).toHaveLength(1);
      expect(querier.getEntry(queryKey)).toEqual(storeMock[queryKey]);
      expect(querier.getEntry('queryKeyThatDoesNotExist')).toBeNull();
    });
  });
  describe('initialisation', () => {
    it('intializes with empty store', () => {
      const querier = new Querier();
      expect(querier.getStore()).toEqual({});
    });

    it('intializes with predefined store', () => {
      const querier = new Querier(storeMock);
      expect(querier.getStore()).toEqual(storeMock);
    });
  });

  describe('query mutations', () => {
    let querier = new Querier();
    const queryProps = { a: 1 };
    const queryError = new Error('Nay:/');

    afterEach(() => {
      querier = new Querier();
    });

    describe('updateQuery generic mutation', () => {
      it('calls listeners with updated query', () => {
        const listener = jest.fn();
        const unsubscribe = querier.subscribe(queryKey, listener);
        const queryUpdate = { id: queryKey, result: queryResult };

        querier.updateQuery(queryKey, queryUpdate);

        expect(listener).toBeCalledWith(queryUpdate);
      });

      it('does not notify listeners if silent', () => {
        const listener = jest.fn();
        const unsubscribe = querier.subscribe(queryKey, listener);

        querier.updateQuery(queryKey, {}, true);

        expect(listener).not.toBeCalled();
      });
    });

    test('startQuery mutation', () => {
      const expectedResult: QuerierStateEntry<{}> = {
        id: queryKey,
        result: null,
        state: { state: QuerierState.Active },
        $props: queryProps,
        $reason: queryReason
      };
      querier.startQuery(queryKey, queryProps, queryReason);

      expect(querier.getEntry(queryKey)).toEqual(expectedResult);
    });

    test('successQuery mutation', () => {
      const expectedResult = {
        result: queryResult,
        state: { state: QuerierState.Success }
      };
      querier.successQuery(queryKey, queryResult);

      expect(querier.getEntry(queryKey)).toEqual(expectedResult);
    });

    test('failQuery mutation', () => {
      const expectedResult = {
        result: null,
        state: {
          state: QuerierState.Error,
          error: queryError
        }
      };
      querier.failQuery(queryKey, queryError);

      expect(querier.getEntry(queryKey)).toEqual(expectedResult);
    });
  });

  describe('subscription', () => {
    it('allows subscription', () => {
      const querier = new Querier();

      expect(querier.getListeners().size).toEqual(0);
      expect(querier.getListenersByKey('key')).toBeUndefined();

      querier.subscribe('key', jest.fn());

      expect(querier.getListeners().size).toEqual(1);
      expect(querier.getListenersByKey('key').length).toEqual(1);
    });

    it('allows subscription cancelation', () => {
      const querier = new Querier();
      const unsubscribe = querier.subscribe('key', jest.fn());

      expect(querier.getListeners().size).toEqual(1);

      unsubscribe();

      expect(querier.getListenersByKey('key')).toBeUndefined();
      expect(querier.getListeners().size).toEqual(0);
    });
  });

  describe('sending query', () => {
    describe('cache', () => {
      let querySpy;
      let listenerSpy;
      let spiedQuery;

      beforeEach(() => {
        querySpy = jest.fn();
        listenerSpy = jest.fn();
        spiedQuery = async () => {
          querySpy();
          return await successQuery();
        };
      });

      it('serves from cache if query result is available', async () => {
        const store: QuerierStoreType = createStoreMock();

        const querier = new Querier(store);
        querier.subscribe(queryKey, listenerSpy);

        expect(listenerSpy).not.toBeCalled();

        querier.sendQuery({
          query: spiedQuery,
          queryKey: queryKey
        });

        expect(querySpy).not.toBeCalled();
        expect(listenerSpy).toBeCalledWith(store[queryKey]);
      });

      it('serves from cache if query is active', () => {
        const store: QuerierStoreType = createStoreMock({ state: QuerierState.Active });

        const querier = new Querier(store);

        querier.subscribe(queryKey, listenerSpy);

        expect(listenerSpy).not.toBeCalled();

        querier.sendQuery({
          query: spiedQuery,
          queryKey: queryKey
        });

        expect(querySpy).not.toBeCalled();
        expect(listenerSpy).toBeCalledWith(store[queryKey]);
      });

      it('ignores cache if query is set to hot', async () => {
        const store: QuerierStoreType = createStoreMock();
        const querier = new Querier(store);
        querier.subscribe(queryKey, listenerSpy);

        expect(listenerSpy).not.toBeCalled();

        await querier.sendQuery({
          query: spiedQuery,
          queryKey: queryKey,
          reason: queryReason,
          hot: true
        });

        expect(querySpy).toBeCalled();
        expect(listenerSpy.mock.calls.length).toBe(2);
        expect(listenerSpy).toBeCalledWith({
          id: queryKey,
          result: null,
          state: { state: QuerierState.Active },
          $props: null,
          $reason: queryReason
        });
        expect(listenerSpy).toBeCalledWith({
          id: queryKey,
          result: queryResult,
          state: { state: QuerierState.Success },
          $props: null,
          $reason: queryReason
        });
      });
    });

    describe('flow', () => {
      it('executes passed query', async () => {
        const querySpy = jest.fn();
        const spiedQuery = async () => {
          querySpy();
          return await successQuery();
        };
        const store: QuerierStoreType = createStoreMock();
        const querier = new Querier(store);

        expect(querySpy).not.toBeCalled();

        await querier.sendQuery({
          query: spiedQuery,
          queryKey: queryKey,
          reason: queryReason,
          hot: true
        });

        expect(querySpy).toBeCalled();
      });

      it('performs successQuery mutation on query sucess', async () => {
        const querySpy = jest.fn();

        const spiedQuery = async () => {
          querySpy();
          return await successQuery();
        };
        const store: QuerierStoreType = createStoreMock();
        const querier = new Querier(store);

        await querier.sendQuery({
          query: spiedQuery,
          queryKey: queryKey,
          reason: queryReason,
          hot: true
        });

        expect(Object.keys(querier.getStore())).toHaveLength(1);
        expect(querier.getEntry(queryKey)).toEqual({
          id: queryKey,
          result: queryResult,
          state: { state: QuerierState.Success },
          $props: null,
          $reason: queryReason
        });
      });

      it('performs failQuery mutation on query failure', async () => {
        const querySpy = jest.fn();

        const spiedQuery = async () => {
          querySpy();
          return await failQuery();
        };
        const store: QuerierStoreType = createStoreMock();
        const querier = new Querier(store);

        await querier.sendQuery({
          query: spiedQuery,
          queryKey: queryKey,
          reason: queryReason,
          hot: true
        });

        expect(Object.keys(querier.getStore())).toHaveLength(1);
        expect(querier.getEntry(queryKey)).toHaveProperty('state.error', {
          error: 'User with 3 not found.'
        });
        expect(querier.getEntry(queryKey)).toHaveProperty('state.state', QuerierState.Error);
      });
    });
  });

  describe('query effects', () => {
    const actionCreatorMock = payload => {
      return {
        type: 'actionType',
        payload
      };
    };

    it('performs query effects on query success', async () => {
      const dispatchSpy = jest.fn();

      const querier = new Querier({}, dispatchSpy);

      await querier.sendQuery({
        query: successQuery,
        queryKey: queryKey,
        reason: queryReason,
        effects: [actionCreatorMock]
      });

      expect(dispatchSpy).toBeCalledWith(actionCreatorMock(queryResult));
    });

    describe('when dispatcher not passed to querier during initialisation', () => {
      it('rejects and performs failQuery mutation', async () => {
        const querier = new Querier();

        await expect(
          querier.sendQuery({
            query: successQuery,
            queryKey: queryKey,
            reason: queryReason,
            effects: [actionCreatorMock]
          })
        ).rejects.toEqual(new NoDispatcherError());

        expect(querier.getEntry(queryKey)).toHaveProperty('state.error', new NoDispatcherError());
        expect(querier.getEntry(queryKey)).toHaveProperty('state.state', QuerierState.Error);
      });
    });
  });
});
