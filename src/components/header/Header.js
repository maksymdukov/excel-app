import { ExcelComponent } from 'core/ExcelComponent';
import { $ } from 'core/dom';
import { changeTitle } from 'redux/actions';

export class Header extends ExcelComponent {
  constructor($root, options) {
    super($root, {
      ...options,
      listeners: ['click', 'input'],
    });
  }

  static className = 'excel__header';

  toHTML() {
    const title = this.store.getState().title;
    return `
    <input type="text" class="title-input" value="${title}" />

    <div>
        <div class="button">
          <i class="material-icons">exit_to_app</i>
        </div>

        <div class="button">
          <i class="material-icons">delete</i>
    </div>
    `;
  }

  onInput(ev) {
    const $target = $(ev.target);
    this.$dispatch(changeTitle($target.text()));
  }

  onClick() {}
}
