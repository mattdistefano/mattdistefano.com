import * as React from 'react';
import { Link } from 'react-router-dom';

// tslint:disable-next-line:variable-name
export const SiteHeaderComponent = () => <header className="site-header">
  <div className="site-header__inner container">
    <Link to="/" className="logo site-header__logo">mattdistefano</Link>
  </div>
</header>;
