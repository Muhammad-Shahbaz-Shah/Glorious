export function throttle(func, wait) {
  let timeout = null;
  let lastArgs = null;
  let lastContext = null;

  const later = () => {
    if (lastArgs) {
      func.apply(lastContext, lastArgs);
      lastArgs = null;
      lastContext = null;
      timeout = setTimeout(later, wait);
    } else {
      timeout = null;
    }
  };

  return function (...args) {
    if (!timeout) {
      func.apply(this, args);
      timeout = setTimeout(later, wait);
    } else {
      lastArgs = args;
      lastContext = this;
    }
  };
}
