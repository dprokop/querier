import { withData } from '../src/withData';
import { withDataFactory } from '../src/withDataFactory';
import {
  actionQueryDescriptorsBuilder,
  inputQueryDescriptorsBuilder
} from '../src/utils/queryDescriptorBuilders';

jest.mock('../src/withDataFactory', () => {
  return {
    withDataFactory: jest.fn()
  };
});

describe('withData', () => {
  it('passes query descriptors built from query definitions to withDataFactory', () => {
    // withDataFactory export is mocked in L8
    // We need to cast it to jest.Mock, as TS does not understand import mocks
    const withDataFactoryMock = withDataFactory as jest.Mock<{}>;
    const inputQueries = {
      inputQuery: {
        query: async () => {
          return {};
        }
      }
    };
    const actionQueries = {
      actionQuery: {
        query: async () => {
          return {};
        }
      }
    };
    expect(withDataFactoryMock.mock.calls).toHaveLength(0);

    const decorator = withData({
      inputQueries,
      actionQueries
    });

    expect(withDataFactoryMock.mock.calls).toHaveLength(1);

    expect(JSON.stringify(withDataFactoryMock.mock.calls[0][0])).toEqual(
      JSON.stringify({
        inputQueries: inputQueryDescriptorsBuilder(inputQueries),
        actionQueries: actionQueryDescriptorsBuilder(actionQueries)
      })
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
