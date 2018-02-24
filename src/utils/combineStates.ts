import { StatesType, QuerierState, QueryStateType } from '../types';

export const combineStates = (states: StatesType): QueryStateType => {
  let successes = 0;
  let active = 0;

  for (let key in states) {
    if (key && states[key]) {
      if (states[key].state === QuerierState.Active) {
        active++;
      }
      if (states[key].state === QuerierState.Error) {
        return {
          state: QuerierState.Error,
          error: states[key].error
        };
      }
      if (states[key].state === QuerierState.Success) {
        successes++;
      }
    }
  }

  if (active !== 0) {
    return {
      state: QuerierState.Active
    };
  }

  if (successes === Object.keys(states).length) {
    return {
      state: QuerierState.Success
    };
  }

  return {
    state: QuerierState.Pending
  };
};
