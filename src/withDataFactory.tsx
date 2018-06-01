import * as PropTypes from 'prop-types';
import * as React from 'react';
import shallowequal from 'shallowequal';

import { QuerierProviderContext } from './QuerierProvider';
import {
  ActionQueriesProps,
  InjectedResults,
  InjectedStates,
  QuerierStateEntry,
  WithDataProps,
  WrappedActionQueries,
  WrappedInputQueries,
  InferableComponentEnhancer,
  InputQueriesProps,
  InputQueryExecutor
} from './types';
import invariant from 'invariant';

// tslint:disable-next-line
const getComponentDisplayName = (wrapped: React.ComponentType<any>) => {
  return wrapped.displayName || wrapped.name || 'Component';
};

export const withDataFactory = <TProps, TInputQueries, TActionQueries>(queries: {
  inputQueries?: WrappedInputQueries<TProps, TInputQueries> | null;
  actionQueries?: WrappedActionQueries<TActionQueries>;
}): InferableComponentEnhancer<TProps, TInputQueries, TActionQueries> => (
  Component: React.ComponentType<WithDataProps<TProps, TInputQueries, TActionQueries>>
) => {
    class WithData extends React.Component<TProps> {
      static displayName = `WithData(${getComponentDisplayName(Component)})`;
      static contextTypes = {
        querier: PropTypes.object
      };
      private hasMounted: boolean = false;

      context: QuerierProviderContext;

      private querierSubscriptions: Array<() => void> = [];
      private propsToQueryKeysMap: Map<string, string> = new Map();
      private executors: InputQueriesProps<TInputQueries>;

      constructor(props: TProps, context: QuerierProviderContext) {
        super(props, context);
        this.handleQuerierUpdate = this.handleQuerierUpdate.bind(this);
        this.initializeInputQueriesExecutors = this.initializeInputQueriesExecutors.bind(this);
        this.initializePropsToQueryKeysMap();
        this.initializeInputQueriesExecutors();

        invariant(
          context.querier,
          'Querier is not available in the context. Make sure you have wrapped your root component ' +
          'with QuerierProvider'
        );
      }

      componentDidMount() {
        this.fireInputQueries();
        this.hasMounted = true;
      }

      componentDidUpdate(prevProps: TProps) {
        if (!shallowequal(this.props, prevProps)) {
          this.unsubscribeQuerier();
          this.initializeInputQueriesExecutors();
          this.fireInputQueries();
        }
      }

      componentWillUnmount() {
        this.unsubscribeQuerier();
        this.hasMounted = false;
      }

      initializePropsToQueryKeysMap() {
        const { inputQueries } = queries;

        if (inputQueries) {
          for (let prop in inputQueries) {
            if (prop) {
              const queryKey = `${inputQueries[prop].key}:${JSON.stringify(this.props)}`;
              this.propsToQueryKeysMap.set(prop, queryKey);
            }
          }
        }
      }

      fireInputQueries() {
        for (const executor in this.executors) {
          if (executor) {
            this.executors[executor].fire();
          }
        }
      }

      unsubscribeQuerier() {
        this.querierSubscriptions = this.querierSubscriptions.filter(unsubscribe => {
          return unsubscribe();
        });
      }

      handleQuerierUpdate(queryData: QuerierStateEntry<{}>) {
        if (this.hasMounted) {
          this.setState({});
        }
      }

      buildComponentPropsFromResults() {
        let props = {
          results: {},
          states: {}
        };
        this.propsToQueryKeysMap.forEach((queryKey, prop) => {
          const queryStoreEntry = this.context.querier.getEntry(queryKey);
          const result: {
            [key: string]: {} | null;
          } = {};
          const states: {
            [key: string]: {} | null;
          } = {};
          result[prop] = queryStoreEntry && queryStoreEntry.result;
          states[prop] = queryStoreEntry && queryStoreEntry.state;

          props = {
            results: {
              ...props.results,
              ...result
            },
            states: {
              ...props.states,
              ...states
            }
          };
        });
        return props as {
          results: InjectedResults<TInputQueries, TActionQueries>;
          states: InjectedStates<TInputQueries, TActionQueries>;
        };
      }

      getWrappedActionQueries() {
        const { actionQueries } = queries;
        const { querier } = this.context;
        let wrappedActionQueries = {};

        if (actionQueries) {
          for (let actionQueryProp in actionQueries) {
            if (actionQueryProp) {
              const wrappedActionQuery: {
                [key: string]: <TArgs>(args: TArgs) => void;
              } = {};

              wrappedActionQuery[actionQueryProp] = actionQueryParams => {
                const query = () => actionQueries[actionQueryProp].query(actionQueryParams);
                const queryKey = `${actionQueries[actionQueryProp].key}:${JSON.stringify(
                  actionQueryParams
                )}`;
                this.propsToQueryKeysMap.set(actionQueryProp, queryKey);

                querier.subscribe(queryKey, this.handleQuerierUpdate);
                querier.sendQuery({
                  query,
                  queryKey,
                  hot: actionQueries[actionQueryProp].hot,
                  props: actionQueryParams,
                  reason: getComponentDisplayName(Component)
                });
              };

              wrappedActionQueries = {
                ...wrappedActionQueries,
                ...wrappedActionQuery
              };
            }
          }
        }
        return wrappedActionQueries as ActionQueriesProps<TActionQueries>;
      }

      initializeInputQueriesExecutors() {
        const { querier } = this.context;
        const { inputQueries } = queries;

        let executors = {};
        if (inputQueries) {
          for (let prop in inputQueries) {
            if (prop) {
              const query = () => inputQueries[prop].query(this.props);
              const queryKey = `${inputQueries[prop].key}:${JSON.stringify(this.props)}`;
              this.propsToQueryKeysMap.set(prop, queryKey);

              this.querierSubscriptions.push(querier.subscribe(queryKey, this.handleQuerierUpdate));
              const executor: {
                [key: string]: InputQueryExecutor
              } = {};

              executor[prop] = {
                fire: (() => {
                  querier.sendQuery({
                    query,
                    queryKey,
                    props: this.props,
                    reason: getComponentDisplayName(Component),
                    effects: inputQueries[prop].resultActions,
                    hot: !!inputQueries[prop].hot
                  });
                }).bind(this)
              };

              executors = {
                ...executors,
                ...executor
              };
            }
          }
        }

        this.executors = executors as InputQueriesProps<TInputQueries>;
      }

      render() {
        const { results, states } = this.buildComponentPropsFromResults();
        return (
          <Component
            results={results}
            actionQueries={this.getWrappedActionQueries()}
            inputQueries={this.executors}
            states={states}
            {...this.props}
          />
        );
      }
    }

    return WithData;
  };
