import {
  actionQueryDescriptorsBuilder,
  inputQueryDescriptorsBuilder
} from './utils/queryDescriptorBuilders';
import withDataFactory from './withDataFactory';
import { DataDependenciesDescriptor, InferableComponentEnhancer } from './types';

function withData<TProps, TInputQueries, TActionQueries>(
  dependencies: DataDependenciesDescriptor<TProps, TInputQueries, TActionQueries>
): InferableComponentEnhancer<TProps, TInputQueries, TActionQueries> {
  const { actionQueries } = dependencies;

  const inputQueriesDescriptor = dependencies.inputQueries &&
    inputQueryDescriptorsBuilder(dependencies.inputQueries);

  const actionQueriesDescriptor = actionQueries &&
    actionQueryDescriptorsBuilder(actionQueries);

  return withDataFactory<
    TProps,
    TInputQueries,
    TActionQueries
    >({
      inputQueries: inputQueriesDescriptor,
      actionQueries: actionQueriesDescriptor,
    });
}

export default withData;
