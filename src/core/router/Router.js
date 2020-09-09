import { $ } from 'core/dom';
import { ActiveRoute } from 'core/router/ActiveRoute';

export class Router {
  constructor(selector, routes) {
    if (!selector) {
      throw new Error('Selector is required in Router');
    }

    this.$placeholder = $(selector);
    this.routes = routes;
    this.currentPage = null;
    this.changePageHandler = this.changePageHandler.bind(this);

    this.init();
  }

  init() {
    window.addEventListener('hashchange', this.changePageHandler);
    this.changePageHandler();
  }

  changePageHandler() {
    // cleanup
    if (this.currentPage) {
      this.currentPage.destroy();
      this.$placeholder.clear();
    }

    // identify page
    const path = ActiveRoute.path.split('/')[0];
    let Page = this.routes[path];
    if (!Page) {
      Page = this.routes.index;
    }
    this.currentPage = new Page(ActiveRoute.params);
    const html = this.currentPage.getRoot();

    // render
    this.$placeholder.append(html);
    this.currentPage.afterRender();
  }

  destroy() {
    window.removeEventListener('hashchange', this.changePageHandler);
  }
}
