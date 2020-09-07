export function capitalize(string) {
  if (typeof string !== 'string') {
    return '';
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function throttle(fn, timeout) {
  let timer = null;
  return function (...args) {
    const that = this;
    if (!timer) {
      fn.apply(that, args);
      timer = setTimeout(() => {
        fn.apply(that, args);
        timer = null;
      }, timeout);
    }
  };
}

export function range(start, end) {
  if (start > end) {
    [end, start] = [start, end];
  }
  return new Array(end - start + 1).fill('').map((_, idx) => idx + start);
}
