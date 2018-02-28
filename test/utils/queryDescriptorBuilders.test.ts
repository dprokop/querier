import { InputQueryDefinition } from '../../src';
import {
  actionQueryDescriptorsBuilder,
  inputQueryDescriptorsBuilder
} from '../../src/utils/queryDescriptorBuilders';

describe('queryDescriptorBuilders', () => {
  describe('inputQueryDescriptorsBuilder', () => {
    it('auguments query hot and resultActions properties if not present in definition', () => {
      const inputQuery: InputQueryDefinition<{}, {}> = {
        query: async (props: {}) => {
          return {};
        }
      };
      const queryDesciptors = inputQueryDescriptorsBuilder({
        inputQuery
      });
      expect(queryDesciptors.inputQuery).toHaveProperty('hot', false);
      expect(queryDesciptors.inputQuery).toHaveProperty('resultActions', null);
    });

    it('wraps query in a function', () => {
      const querySpy = jest.fn();
      const inputQuery = {
        query: async (props: { a: number }) => {
          querySpy(props);
          return {};
        }
      };

      const queryDesciptors = inputQueryDescriptorsBuilder({
        inputQuery
      });

      expect(queryDesciptors.inputQuery.query).toBeInstanceOf(Function);
      expect(querySpy).not.toBeCalled();
      queryDesciptors.inputQuery.query({ a: 1 });

      expect(querySpy).toBeCalledWith({ a: 1 });
    });

    it('adds query key base built from query name', () => {
      const testQuery = async () => {
        return {};
      };
      const inputQuery = {
        query: testQuery
      };
      const queryDesciptor = inputQueryDescriptorsBuilder({
        inputQuery
      });

      expect(queryDesciptor.inputQuery.key).toBe('testQuery');
    });

    it('handles empty query definitions', () => {
      expect(inputQueryDescriptorsBuilder({})).toEqual({});
    });
  });

  describe('actionQueryDescriptorsBuilder', () => {
    it('auguments query hot property if not present in definition', () => {
      const actionQuery = {
        query: async (props: {}) => {
          return {};
        }
      };

      const queryDesciptor = actionQueryDescriptorsBuilder({
        actionQuery
      });

      expect(queryDesciptor.actionQuery).toHaveProperty('hot', false);
      expect(queryDesciptor.actionQuery).not.toHaveProperty('resultActions');
    });

    it('adds query key base built from query name', () => {
      const testQuery = async () => {
        return {};
      };
      const actionQuery = {
        query: testQuery
      };
      const queryDesciptor = actionQueryDescriptorsBuilder({
        actionQuery
      });

      expect(queryDesciptor.actionQuery.key).toBe('testQuery');
    });

    it('handles empty query definitions', () => {
      expect(actionQueryDescriptorsBuilder({})).toEqual({});
    });
  });
});
