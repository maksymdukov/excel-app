import { Page } from 'core/page/Page';
import { Router } from '../Router';

class DashboardPage extends Page {
  getRoot() {
    const root = document.createElement('div');
    root.innerHTML = 'dashboard';
    return root;
  }
}
class ExcelPage extends Page {
  getRoot() {
    const root = document.createElement('div');
    root.innerHTML = 'excel';
    return root;
  }
}

describe('Router', () => {
  let router;
  let $root;
  beforeEach(() => {
    $root = document.createElement('div');
    router = new Router($root, {
      index: DashboardPage,
      dashboard: DashboardPage,
      excel: ExcelPage,
    });
  });

  it('should render dashboard page', () => {
    window.location.hash = 'dashboard';
    expect($root.innerHTML).toContain('dashboard');
  });

  it('should render excel page', async () => {
    window.location.hash = 'excel';
    await router.changePageHandler();
    expect($root.innerHTML).toContain('excel');
  });
});
