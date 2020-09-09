import { ExcelComponent } from 'core/ExcelComponent';
import { $ } from 'core/dom';
import { changeTitle } from 'redux/actions';
import { ActiveRoute } from 'core/router/ActiveRoute';

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
        <a class="button" href="#dashboard">
          <i class="material-icons">exit_to_app</i>
        </a>

        <div class="button" data-button="delete">
          <i class="material-icons">delete</i>
    </div>
    `;
  }

  onInput(ev) {
    const $target = $(ev.target);
    this.$dispatch(changeTitle($target.text()));
  }

  onClick(ev) {
    const deleteButton = $(ev.target).closest('[data-button="delete"]');
    if (deleteButton.$el) {
      const decision = window.confirm('Do you really want to delete it?');
      if (decision) {
        localStorage.removeItem(`excel:${ActiveRoute.params}`);
        ActiveRoute.navigate('dashboard');
      }
    }
  }
}
