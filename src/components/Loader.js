import { $ } from 'core/dom';

export const Loader = () => {
  return $.create('div', 'loader').html(`
  <div class="lds-roller">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
  `);
};
