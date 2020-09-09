import { storage } from 'core/utils';

export const toHTML = (key) => {
  const timestamp = +key.split(':')[1];
  const state = storage(key);
  const date = new Date(state.lastTimeAccessed).toLocaleString();
  const title = state.title;
  return `
        <li class="db__record">
          <a href="#excel/${timestamp}">${title}</a>
          <strong>${date}</strong>
        </li>  
  `;
};

// excel:123123123
const getAllKeys = () => {
  const keys = [];
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      if (!key.includes('excel')) continue;
      keys.push(key);
    }
  }
  return keys;
};

export const createRecordsTable = () => {
  const keys = getAllKeys();
  if (!keys.length) {
    return `<p>No tables yet</p>`;
  }
  return `
      <div class="db__list-header">
        <span>Name</span>
        <span>Last time opened</span>
      </div>

      <ul class="db__list">
         ${keys.map(toHTML).join('')}
      </ul>
  `;
};
