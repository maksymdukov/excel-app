import { createStore } from '../createStore';

const initialState = { count: 0 };

const reducer = (state = initialState, action) => {
  if (action.type === 'ADD') return { ...state, count: state.count + 1 };
  return state;
};

describe('createStore', () => {
  let store;
  beforeEach(() => {
    store = createStore(reducer);
  });
  it('returns store with methods', () => {
    expect(store.dispatch).toBeDefined();
    expect(store.subscribe).toBeDefined();
    expect(store.getState).toBeDefined();
  });

  it('getState should return initialState', () => {
    expect(store.getState()).toEqual(initialState);
  });

  it('dispatch should change state on action', () => {
    expect(store.getState().count).toBe(initialState.count);
    store.dispatch({ type: 'ADD' });
    expect(store.getState().count).toBe(initialState.count + 1);
  });

  it('dispatch should not change state if action doesnt exist', () => {
    expect(store.getState().count).toBe(initialState.count);
    store.dispatch({ type: '__NONE__' });
    expect(store.getState().count).toBe(initialState.count);
  });

  it('subscribe should subscribe and later call listeners', () => {
    const listener = jest.fn();
    store.subscribe(listener);
    store.dispatch({ type: 'ADD' });

    expect(listener).toHaveBeenCalled();
    expect(listener).toHaveBeenCalledWith(store.getState());
  });

  test('unsubscribe should do its things :) ', () => {
    const listener = jest.fn();
    const sub = store.subscribe(listener);
    sub.unsubscribe();
    store.dispatch({ type: 'ADD' });

    expect(listener).not.toHaveBeenCalled();
  });
});
