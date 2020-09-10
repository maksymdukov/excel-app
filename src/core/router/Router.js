import { $ } from 'core/dom';
import { ActiveRoute } from 'core/router/ActiveRoute';
import { Loader } from 'components/Loader';

export class Router {
  constructor(selector, routes) {
    if (!selector) {
      throw new Error('Selector is required in Router');
    }

    this.$placeholder = $(selector);
    this.$loader = new Loader();
    this.routes = routes;
    this.currentPage = null;
    this.changePageHandler = this.changePageHandler.bind(this);

    this.init();
  }

  init() {
    window.addEventListener('hashchange', this.changePageHandler);
    this.changePageHandler();
  }

  async changePageHandler() {
    // cleanup
    if (this.currentPage) {
      this.currentPage.destroy();
      this.$placeholder.clear().append(this.$loader);
    }

    // start spinner
    this.$placeholder.append(this.$loader);

    // identify page
    const path = ActiveRoute.path.split('/')[0];
    let Page = this.routes[path];
    if (!Page) {
      Page = this.routes.index;
    }
    this.currentPage = new Page(ActiveRoute.params);
    const html = await this.currentPage.getRoot();

    // remove spinner
    this.$placeholder.clear();

    // render
    this.$placeholder.append(html);
    this.currentPage.afterRender();
  }

  destroy() {
    window.removeEventListener('hashchange', this.changePageHandler);
  }
}
