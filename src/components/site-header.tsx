import { h } from 'preact';
import { Link } from 'preact-router';

// tslint:disable-next-line:variable-name
export const SiteHeaderComponent = () => <header class="site-header">
  <div class="site-header__inner container">
    <Link href="/" class="logo site-header__logo">mattdistefano</Link>
  </div>
</header>;
