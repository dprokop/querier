import { combineStates } from '../../src/utils/combineStates';
import { StatesType, QuerierState } from '../../src/types';
import { QueryStateType } from '../../src';

const createStateProps = (stateTypes: Array<QuerierState>): StatesType => {
  let result = {};
  stateTypes.forEach((stateType: QuerierState, key) => {
    result[`props${key}`] = {
      state: QuerierState[QuerierState[stateType]],
      error: stateType === QuerierState.Error ? 'Query failed' : null
    };
  });

  return result;
};

describe('Utils', () => {
  describe('combineStates', () => {
    it('returns error state if any error available', () => {
      const states: StatesType = createStateProps([
        QuerierState.Active,
        QuerierState.Success,
        QuerierState.Error
      ]);

      expect(combineStates(states)).toEqual({
        state: QuerierState.Error,
        error: 'Query failed'
      });
    });

    it('returns active state if no error and any active state available', () => {
      const states: StatesType = createStateProps([
        QuerierState.Active,
        QuerierState.Success,
        QuerierState.Success
      ]);
      expect(combineStates(states)).toEqual({
        state: QuerierState.Active
      });
    });

    it('returns success state all states are success', () => {
      const states: StatesType = createStateProps([
        QuerierState.Success,
        QuerierState.Success,
        QuerierState.Success
      ]);

      expect(combineStates(states)).toEqual({
        state: QuerierState.Success
      });
    });

    it('returns pending state all states are pending', () => {
      const states: StatesType = createStateProps([
        QuerierState.Pending,
        QuerierState.Pending,
        QuerierState.Pending
      ]);

      expect(combineStates(states)).toEqual({
        state: QuerierState.Pending
      });
    });
  });
});
