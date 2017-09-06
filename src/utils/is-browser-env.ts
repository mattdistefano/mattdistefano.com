// assumption is the pre-render may set the document global but will not set addEventListener
export default typeof document !== 'undefined' &&
  typeof document.addEventListener === 'function';
