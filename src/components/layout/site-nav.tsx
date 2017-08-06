import * as React from 'react';
import { NavLink } from 'react-router-dom';

interface SiteNavProps {
  className?: string;
}

export const SiteNavComponent = (props: SiteNavProps) =>
  <nav className={`site-nav ${props.className || ''}`}>
    <ul className="list-unstyled site-nav__list">
      <li className="site-nav__list-item">
        <NavLink exact className="site-nav__link site-nav__link-home" to="/">
          Home
        </NavLink>
      </li>
      <li className="site-nav__list-item">
        <NavLink className="site-nav__link" to="/articles/">
          Articles
        </NavLink>
      </li>
      <li className="site-nav__list-item">
        <NavLink className="site-nav__link" to="/blog/">
          Blog
        </NavLink>
      </li>
    </ul>
  </nav>;
