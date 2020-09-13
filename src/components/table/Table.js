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
import { CellValueResolver } from './CellValueResolver';

export class Table extends ExcelComponent {
  static className = 'excel__table';

  constructor($root, options) {
    super($root, {
      listeners: ['mousedown', 'keydown', 'input'],
      ...options,
    });
    this.cellValueResolver = new CellValueResolver(this);
  }

  toHTML() {
    return createTable(15, this.store.getState(), this.cellValueResolver);
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
      this.selection.current.attr('data-value', text).text(text);
    });
    this.$on('formula:done', () => {
      const text = this.selection.current.attr('data-value');
      const cellId = this.selection.current.id();

      const parsed = this.cellValueResolver.parseValue(text, cellId);
      this.selection.current.focus();

      if (parsed.formula) {
        this.selection.current
          .attr('data-value', parsed.formula)
          .text(parsed.number);
        this.updateFormulaInStore(parsed.formula);
        return;
      }

      if (!parsed.formula && parsed.number) {
        this.selection.current.attr('data-value', '').text(parsed.number);
        this.updateTextInStore(parsed.number);
      }

      if (parsed.error) {
        this.selection.current.text(parsed.error);
        this.updateTextInStore(parsed.error);
      }
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

  updateFormulaInStore(formula) {
    this.$dispatch(
      tableActions.changeFormula({
        formula: `${formula}`,
        id: this.selection.current.id(),
      })
    );
  }

  updateTextInStore(text) {
    this.$dispatch(
      tableActions.changeNumber({
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

  updateCellValue(selector, text) {
    if (!this.mounted) {
      return;
    }
    this.$root.find(selector).text(text);
  }
}
