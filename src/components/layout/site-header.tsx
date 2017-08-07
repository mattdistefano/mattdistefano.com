import * as React from 'react';
import { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { SiteNavComponent } from './site-nav';
import isBrowserEnv from '../../utils/is-browser-env';

interface SiteHeaderProps {}
interface SiteHeaderState {
  isFixed: boolean;
}

export class SiteHeaderComponent extends Component<
  SiteHeaderProps,
  SiteHeaderState
> {
  constructor() {
    super();

    this._onScroll = this._onScroll.bind(this);

    this.state = {
      isFixed: false
    };
  }

  private _onScroll(e: MouseEvent) {
    if (this.state.isFixed && window.scrollY < 128) {
      this.setState({
        isFixed: false
      });
    } else if (!this.state.isFixed && window.scrollY >= 128) {
      this.setState({
        isFixed: true
      });
    }
  }

  componentDidMount() {
    if (!isBrowserEnv) {
      return;
    }
    // TODO passive listener
    window.addEventListener('scroll', this._onScroll);
  }

  componentWillUnmount() {
    if (!isBrowserEnv) {
      return;
    }
    window.removeEventListener('scroll', this._onScroll);
  }

  render() {
    return (
      <header className={`site-header ${this.state.isFixed ? 'fixed' : ''}`}>
        <div className="container">
          <div className="site-header__inner">
            <Link to="/" className="site-header__banner">
              <span className="sr-only">mattdistefano</span>
            </Link>
            <SiteNavComponent />
          </div>
        </div>
      </header>
    );
  }
}
