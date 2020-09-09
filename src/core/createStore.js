export function createStore(rootReducer, initState) {
  let state = rootReducer(initState, { type: '@@INIT' });
  let listeners = [];

  const originalDispatch = (action) => {
    state = rootReducer(state, action);
    listeners.forEach((fn) => fn(state));
  };

  return {
    subscribe(fn) {
      listeners.push(fn);
      return {
        unsubscribe: () => {
          listeners = listeners.filter((sub) => sub !== fn);
        },
      };
    },
    dispatch: originalDispatch,
    getState() {
      return state;
    },
  };
}

export function combineReducers(stateSlices) {
  return (state, action) => {
    return Object.keys(stateSlices).reduce((acc, stateKey) => {
      (acc || {})[stateKey] = stateSlices[stateKey](
        (state && state[stateKey]) || undefined,
        action
      );
      return acc;
    }, {});
  };
}

export function createSelector(inputSelector, outputSelector) {
  let prevInputState;
  let outputData;
  return (state) => {
    const inputState = inputSelector(state);
    if (inputState !== prevInputState) {
      outputData = outputSelector(inputState);
      prevInputState = inputState;
      return outputData;
    }
    return outputData;
  };
}
