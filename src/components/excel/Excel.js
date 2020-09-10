import { $ } from 'core/dom';
import { EventEmitter } from 'core/EventEmitter';
import { StoreSubscriber } from 'core/store/StoreSubscriber';
import { changeAccessTime } from 'redux/actions';
import { isProd } from 'core/utils';

export class Excel {
  constructor(options) {
    this.components = options.components || [];
    this.store = options.store;
    this.emitter = new EventEmitter();
    this.subscriber = new StoreSubscriber(this.store);
  }

  getRoot() {
    const $root = $.create('div', 'excel');
    const componentOptions = { emitter: this.emitter, store: this.store };
    this.components = this.components.map((Component) => {
      const $el = $.create('div', Component.className);
      const component = new Component($el, componentOptions);
      $el.html(component.toHTML());
      $root.append($el);
      return component;
    });
    return $root;
  }

  preventDefault(e) {
    e.preventDefault();
  }

  init() {
    if (isProd) {
      window.addEventListener('contextmenu', this.preventDefault);
    }
    this.store.dispatch(changeAccessTime());
    this.subscriber.subscribeComponents(this.components);
    this.components.forEach((comp) => comp.init());
  }

  destroy() {
    if (isProd) {
      window.removeEventListener('contextmenu', this.preventDefault);
    }
    this.subscriber.unsubscribeFromStore();
    this.components.forEach((cmp) => cmp.destroy());
  }
}
