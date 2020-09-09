import { isEqual } from 'core/utils';

export class StoreSubscriber {
  constructor(store) {
    this.store = store;
    this.sub = null;
    this.prevState = null;
  }

  subscribeComponents(components) {
    this.prevState = this.store.getState();
    this.sub = this.store.subscribe((state) => {
      Object.keys(state).forEach((key) => {
        if (!isEqual(this.prevState[key], state[key])) {
          components.forEach((cmp) => {
            if (cmp.isWatching(key)) {
              const changes = { [key]: state[key] };
              cmp.storeChanged(changes);
            }
          });
        }
      });
      this.prevState = this.store.getState();
    });
  }

  unsubscribeFromStore() {
    this.sub.unsubscribe();
  }
}
