import { StatesType, QuerierState, QueryStateType } from '../types';

const combineStates = (states: StatesType): QueryStateType => {
  let successes = 0;

  for (let key in states) {
    if (key && states[key]) {
      if (states[key].state === QuerierState.Active) {
        return {
          state: QuerierState.Active
        };
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

  if (successes === Object.keys(states).length) {
    return {
      state: QuerierState.Success
    };
  }

  return {
    state: QuerierState.Pending
  };
};

export default combineStates;
