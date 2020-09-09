export function capitalize(string) {
  if (typeof string !== 'string') {
    return '';
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function throttle(fn, timeout) {
  let timer = null;
  return function (...args) {
    if (!timer) {
      fn.apply(this, args);
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, timeout);
    }
  };
}

export function debounce(fn, timeout) {
  let timer = null;
  return function (...args) {
    const later = () => {
      fn.apply(this, args);
      clearTimeout(timer);
    };
    clearTimeout(timer);
    timer = setTimeout(later, timeout);
  };
}

export function range(start, end) {
  if (start > end) {
    [end, start] = [start, end];
  }
  return new Array(end - start + 1).fill('').map((_, idx) => idx + start);
}

export function storage(key, data = null) {
  if (!data) {
    return JSON.parse(localStorage.getItem(key));
  }
  localStorage.setItem(key, JSON.stringify(data));
}

export function isEqual(prevVal, val) {
  return prevVal === val;
}

export function cameCaseToDash(str) {
  return str.replace(/[A-Z]/g, (g) => `-${g[0].toLocaleLowerCase()}`);
}

export function stylesObjToString(obj) {
  return Object.keys(obj)
    .map((key) => `${cameCaseToDash(key)}: ${obj[key]}`)
    .join(';');
}

export const isProd = process.env.NODE_ENV === 'production';
