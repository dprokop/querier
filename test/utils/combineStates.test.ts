import { combineStates } from '../../src/utils/combineStates';
import { StatesType, QuerierState } from '../../src/types';

describe('Utils', () => {
  describe('combineStates', () => {

    it('returns error state if any error available', () => {
      const states: StatesType = {
        'prop1': {
          state: QuerierState.Active
        },
        'prop2': {
          state: QuerierState.Success
        },
        'prop3': {
          state: QuerierState.Error,
          error: 'Query failed'
        },
      };

      expect(combineStates(states)).toEqual({
        state: QuerierState.Error,
        error: 'Query failed'
      });
    });

    it('returns active state if no error and any active state available', () => {
      const states: StatesType = {
        'prop1': {
          state: QuerierState.Active
        },
        'prop2': {
          state: QuerierState.Success
        },
        'prop3': {
          state: QuerierState.Success,
        },
      };

      expect(combineStates(states)).toEqual({
        state: QuerierState.Active,
      });
    });

    it('returns success state all states are success', () => {
      const states: StatesType = {
        'prop1': {
          state: QuerierState.Success
        },
        'prop2': {
          state: QuerierState.Success
        },
        'prop3': {
          state: QuerierState.Success
        },
      };

      expect(combineStates(states)).toEqual({
        state: QuerierState.Success
      });
    });

    it('returns pending state all states are pending', () => {
      const states: StatesType = {
        'prop1': {
          state: QuerierState.Pending
        },
        'prop2': {
          state: QuerierState.Pending
        },
        'prop3': {
          state: QuerierState.Pending
        },
      };

      expect(combineStates(states)).toEqual({
        state: QuerierState.Pending,
      });
    });

  });
});
