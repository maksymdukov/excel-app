import { storage } from 'core/utils';

function storageName(param) {
  return 'excel:' + param;
}

export class LocalStorageClient {
  constructor(name) {
    this.name = storageName(name);
  }
  async save(state) {
    storage(this.name, state);
  }

  async get() {
    await new Promise((res) => {
      setTimeout(() => {
        res();
      }, 1000);
    });
    return storage(this.name);
  }
}
