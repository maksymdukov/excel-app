import { Page } from 'core/Page';
import { Excel } from 'components/excel/Excel';
import { Header } from 'components/header/Header';
import { Toolbar } from 'components/toolbar/Toolbar';
import { Formula } from 'components/formula/Formula';
import { Table } from 'components/table/Table';
import { createStore } from 'core/createStore';
import { rootReducer } from 'redux/rootReducer';
import { debounce, storage } from 'core/utils';

function storageName(param) {
  return 'excel:' + param;
}

export class ExcelPage extends Page {
  getRoot() {
    this.params = this.params || Date.now();
    const storeName = storageName(this.params);
    const store = createStore(rootReducer, storage(storeName) || undefined);

    store.subscribe(
      debounce((state) => {
        storage(storeName, state);
      }, 300)
    );

    this.excel = new Excel({
      components: [Header, Toolbar, Formula, Table],
      store,
    });
    return this.excel.getRoot();
  }

  afterRender() {
    this.excel.init();
  }
  destroy() {
    this.excel.destroy();
  }
}
