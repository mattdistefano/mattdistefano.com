import browserRender from './browser';
import prerender from './prerender';

import './css/index.css';

if (typeof document !== 'undefined') {
  browserRender();
}

export default prerender;