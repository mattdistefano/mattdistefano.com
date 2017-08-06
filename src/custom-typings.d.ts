declare module 'smoothscroll-polyfill' {
  interface SmoothScrollPolyfill {
    polyfill: () => void;
  }
  
  var polyfill: SmoothScrollPolyfill;

  export = polyfill;
}