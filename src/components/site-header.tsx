import { h } from 'preact';
import { Link } from 'preact-router';

// tslint:disable-next-line:variable-name
export const SiteHeaderComponent = () => <header className="site-header">
  <div className="site-header__inner container">
    <Link href="/" className="logo site-header__logo">mattdistefano</Link>
  </div>
</header>;
