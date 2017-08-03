import * as React from 'react';
import { NavLink, Link } from 'react-router-dom';

export const SiteNavComponent = () =>
  <nav className="site-nav">
    <ul className="list-unstyled site-nav__list">
      <li className="site-nav__list-item">
        <NavLink exact className="site-nav__link site-nav__link-home" to="/">
          Home
        </NavLink>
      </li>
      <li className="site-nav__list-item">
        <NavLink className="site-nav__link" to="/blog/">
          Blog
        </NavLink>
      </li>
    </ul>
  </nav>;
