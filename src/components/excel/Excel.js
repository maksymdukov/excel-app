import { $ } from 'core/dom';
import { EventEmitter } from 'core/EventEmitter';

export class Excel {
  constructor(selector, options) {
    this.$el = document.querySelector(selector);
    this.components = options.components || [];
    this.emitter = new EventEmitter();
  }

  getRoot() {
    const $root = $.create('div', 'excel');
    const componentOptions = { emitter: this.emitter };
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
    this.components.forEach((comp) => comp.init());
  }
}
