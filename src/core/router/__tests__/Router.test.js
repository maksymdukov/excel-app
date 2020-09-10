import { Router } from '../Router';
import { Page } from '../Page';

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

  it('should render excel page', () => {
    window.location.hash = 'excel';
    router.changePageHandler();
    expect($root.innerHTML).toContain('excel');
  });
});
