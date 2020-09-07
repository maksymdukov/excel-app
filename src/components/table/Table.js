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

export class Table extends ExcelComponent {
  static className = 'excel__table';

  constructor($root, options) {
    super($root, {
      listeners: ['mousedown', 'keydown', 'input'],
      ...options,
    });
  }

  toHTML() {
    return createTable();
  }

  prepare() {
    this.selection = new TableSelection();
  }

  selectCell($cell) {
    this.selection.select($cell);
    this.$emit('table:select', $cell);
  }

  init() {
    super.init();

    this.selectCell(this.$root.find('[data-id="0:0"]'));

    this.$on('formula:input', (text) => {
      this.selection.current.text(text);
    });
    this.$on('formula:done', () => {
      this.selection.current.focus();
    });
  }

  onMousedown(event) {
    if (shouldResize(event)) {
      resizeHandler(this.$root, event);
    } else if (isCell(event)) {
      const $target = $(event.target);
      if (event.shiftKey) {
        event.preventDefault();
        // group
        const ids = matrix($target, this.selection.current);
        const $cells = ids.map((id) => this.$root.find(`[data-id="${id}"]`));
        this.selection.selectGroup($cells);
      } else {
        this.selection.select($target);
        this.$emit('table:select', $target);
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

  onInput(event) {
    if (isCell(event)) {
      this.$emit('table:input', $(event.target));
    }
  }
}
