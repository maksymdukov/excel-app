import { debounce } from 'core/utils';

export class StateProcessor {
  constructor(saver, delay = 300) {
    this.client = saver;
    this.listen = debounce(this.listen.bind(this), delay);
  }
  async listen(state) {
    this.client.save(state);
  }

  async get() {
    return this.client.get();
  }
}
