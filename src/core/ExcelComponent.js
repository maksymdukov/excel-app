import { DomListener } from 'core/DomListener';

export class ExcelComponent extends DomListener {
  constructor($root, options = {}) {
    super($root, options.listeners);
    this.name = options.name || '';
    this.emitter = options.emitter;
    this.unsubs = [];
    this.prepare();
  }
  // called in constructor
  prepare() {}

  toHTML() {
    return '';
  }

  // Called after commitment to DOm
  init() {
    this.initDOMListeners();
  }

  // Cleanup
  destroy() {
    this.removeDOMListeners();
    this.unsubs.forEach((unsub) => unsub());
  }

  // Proxy for inter-component eventEmitter
  $emit(...args) {
    return this.emitter.emit(...args);
  }

  // Proxy for inter-component eventEmitter
  $on(eventName, fn) {
    this.unsubs.push(this.emitter.subscribe(eventName, fn));
  }
}
