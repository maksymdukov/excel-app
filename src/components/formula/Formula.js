import { ExcelComponent } from 'core/ExcelComponent';
import { $ } from 'core/dom';

export class Formula extends ExcelComponent {
  static className = 'excel__formula';

  constructor($root, options) {
    super($root, {
      listeners: ['input', 'keydown'],
      subscribe: ['currentText'],
      ...options,
    });
  }

  init() {
    super.init();
    // eslint-disable-next-line quotes
    this.$formula = this.$root.find(`[data-input="true"]`);

    this.$on('table:select', ($cell) => {
      this.$formula.text($cell.data.value || $cell.text());
    });
  }

  isWatching(key) {
    return this.subscribe.includes(key);
  }

  storeChanged({ currentText }) {
    this.$formula.text(currentText);
  }

  toHTML() {
    return `
      <div class="info">fx</div>
      <div class="input" data-input="true" contenteditable spellcheck="false"></div>
    `;
  }

  onInput(event) {
    this.$emit('formula:input', $(event.target).text());
  }

  onKeydown(event) {
    const keys = ['Enter', 'Tab'];
    if (keys.includes(event.key)) {
      event.preventDefault();
      this.$emit('formula:done');
    }
  }
}
