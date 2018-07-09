import { h, render } from 'preact';

import './style';
import App from './components/app';

let root = document.body.firstElementChild;
let appInstance = null;

const renderApp = () => {
  root = render(<App
    initialPageCache={ appInstance && appInstance.state.pageCache }
    ref={ app => (appInstance = app) }
  />, document.body, root);
}

if (module.hot) {
  module.hot.accept('./components/app', renderApp);
}

renderApp();

// TODO the lack of an export here breaks SSR
