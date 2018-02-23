import {
  InputQueriesDescriptor,
  WrappedInputQueries,
  ActionQueriesDescriptor,
  WrappedActionQueries
} from '../types';
import { buildQueryKey } from './buildQueryKey';

export const inputQueryDescriptorsBuilder = <TProps, TInputQueries>(
  inputQueries: InputQueriesDescriptor<TProps, TInputQueries>
) => {
  let wrappedInputQueries: Partial<
    WrappedInputQueries<TProps, TInputQueries>
  > = {};

  for (let inputQueryProp in inputQueries) {
    if (inputQueryProp) {
      const query = inputQueries[inputQueryProp].query;
      const wrappedQuery = (props: TProps) => query(props);

      const queryKey = buildQueryKey(query);
      let wrappedQueryDescriptor: Partial<
        WrappedInputQueries<TProps, TInputQueries>
      > = {};

      wrappedQueryDescriptor[inputQueryProp] = {
        query: wrappedQuery,
        hot: !!inputQueries[inputQueryProp].hot,
        resultActions: inputQueries[inputQueryProp].resultActions,
        key: queryKey
      };
      wrappedInputQueries = Object.assign(
        {},
        wrappedInputQueries,
        wrappedQueryDescriptor
      );
    }
  }

  return wrappedInputQueries as WrappedInputQueries<TProps, TInputQueries>;
};

export const actionQueryDescriptorsBuilder = <TActionQueries>(
  actionQueries: ActionQueriesDescriptor<TActionQueries>
) => {
  let wrappedActionQueries: Partial<WrappedActionQueries<TActionQueries>> = {};

  for (let actionQueryProp in actionQueries) {
    if (actionQueryProp) {
      const query = actionQueries[actionQueryProp].query;
      // tslint:disable-next-line
      const wrappedQuery = (...args: any[]) => query(...args);

      let queryDescriptor: Partial<WrappedActionQueries<TActionQueries>> = {};

      queryDescriptor[actionQueryProp] = {
        query: wrappedQuery,
        hot: !!actionQueries[actionQueryProp].hot,
        key: buildQueryKey(actionQueries[actionQueryProp].query)
      };

      wrappedActionQueries = Object.assign(
        {},
        wrappedActionQueries,
        queryDescriptor
      );
    }
  }

  return wrappedActionQueries as WrappedActionQueries<TActionQueries>;
};
