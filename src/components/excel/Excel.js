import { $ } from 'core/dom';
import { EventEmitter } from 'core/EventEmitter';
import { StoreSubscriber } from 'core/StoreSubscriber';

export class Excel {
  constructor(selector, options) {
    this.$el = document.querySelector(selector);
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

  render() {
    $(this.$el).append(this.getRoot());
    this.subscriber.subscribeComponents(this.components);
    this.components.forEach((comp) => comp.init());
  }

  destroy() {
    this.subscriber.unsubscribeFromStore();
    this.components.forEach((cmp) => cmp.destroy());
  }
}
