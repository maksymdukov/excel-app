import { ExcelComponent } from 'core/ExcelComponent';
import { createTable } from 'components/table/table.template';
import { resizeHandler } from 'components/table/table.resize';
import {
  isCell,
  matrix,
  nextSelector,
  shouldResize,
} from 'components/table/table.functions';
import { TableSelection } from 'components/table/TableSelection';
import { $ } from 'core/dom';
import * as tableActions from 'redux/actions';
import { defaultStyles } from 'constant';
import { parse } from 'core/parse';

export class Table extends ExcelComponent {
  static className = 'excel__table';

  constructor($root, options) {
    super($root, {
      listeners: ['mousedown', 'keydown', 'input'],
      ...options,
    });
  }

  toHTML() {
    return createTable(15, this.store.getState());
  }

  prepare() {
    this.selection = new TableSelection();
  }

  selectCell($cell) {
    this.selection.select($cell);
    this.$emit('table:select', $cell);
    const styles = $cell.getStyles(Object.keys(defaultStyles));
    this.$dispatch(tableActions.changeStyles(styles));
  }

  async resizeTable(event) {
    try {
      const result = await resizeHandler(this.$root, event);
      this.$dispatch(tableActions.tableResize(result));
    } catch (e) {
      console.error(e);
    }
  }

  init() {
    super.init();

    this.selectCell(this.$root.find('[data-id="0:0"]'));

    this.$on('formula:input', (text) => {
      this.selection.current.attr('data-value', text).text(parse(text));
      this.updateTextInStore(text);
    });
    this.$on('formula:done', () => {
      this.selection.current
        .focus()
        .text(parse(this.selection.current.attr('data-value')));
    });

    this.$on('toolbar:applyStyle', (style) => {
      this.selection.applyStyle(style);
      this.$dispatch(
        tableActions.applyStyle({ style, ids: this.selection.selectedIds })
      );
    });
  }

  onMousedown(event) {
    if (shouldResize(event)) {
      this.resizeTable(event);
    } else if (isCell(event)) {
      const $target = $(event.target);
      if (event.shiftKey) {
        event.preventDefault();
        // group
        const ids = matrix($target, this.selection.current);
        const $cells = ids.map((id) => this.$root.find(`[data-id="${id}"]`));
        this.selection.selectGroup($cells);
      } else {
        this.selectCell($target);
      }
    }
  }

  onKeydown(event) {
    const keys = [
      'Enter',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'ArrowDown',
      'ArrowUp',
    ];

    const { key } = event;
    if (keys.includes(key) && !event.shiftKey) {
      event.preventDefault();
      const id = this.selection.current.id(true);
      const $next = this.$root.find(nextSelector(key, id));
      this.selectCell($next);
    }
  }

  updateTextInStore(text) {
    this.$dispatch(
      tableActions.changeText({
        text,
        id: this.selection.current.id(),
      })
    );
  }

  onInput(event) {
    if (isCell(event)) {
      this.updateTextInStore(this.selection.current.text());
    }
  }
}
