// assumption is the pre-render may set the document global but will not set addEventListener
export const IS_BROWSER_ENV =
  typeof document !== 'undefined' &&
  typeof document.addEventListener === 'function';
