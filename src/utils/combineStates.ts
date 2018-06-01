import { InjectedStates, QuerierState, QueryStateType } from '../types';

export const combineStates = (states: InjectedStates<any, any>): QueryStateType => {
  let successes = 0;
  let active = 0;

  for (let key in states) {
    if (key && states[key]) {
      const state = states[key];
      if (state && state.state === QuerierState.Active) {
        active++;
      }
      if (state && state.state === QuerierState.Error) {
        return {
          state: QuerierState.Error,
          error: state.error
        };
      }
      if (state && state.state === QuerierState.Success) {
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
