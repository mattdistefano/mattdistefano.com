import * as React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { SiteNavComponent } from './site-nav';

export const SiteHeaderComponent = () =>
  <header className="site-header layout__left">
    <span className="sr-only">mattdistefano</span>
    <SiteNavComponent />
  </header>;
