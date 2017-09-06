import * as React from 'react';
import { PureComponent } from 'react';
import { RouteComponentProps } from 'react-router';
import { NavLink, Link } from 'react-router-dom';
import { SiteNavComponent } from './site-nav';
import isBrowserEnv from '../../utils/is-browser-env';
import { headerHeight, breakpoints } from '../../models';

const headerHeightSmallPx = parseInt(headerHeight.small, 10);
const headerHeightMediumPx = parseInt(headerHeight.medium, 10);

interface SiteHeaderState {
  isFixed: boolean;
}

export class SiteHeaderComponent extends PureComponent<
  RouteComponentProps<{}>,
  SiteHeaderState
> {
  private _mq: MediaQueryList;
  private _scrollHeight: number;

  constructor() {
    super();

    this._onScroll = this._onScroll.bind(this);
    this._onMediaChange = this._onMediaChange.bind(this);

    this.state = {
      isFixed: false
    };
  }

  private _onMediaChange(mq: MediaQueryList) {
    if (mq.matches) {
      this._scrollHeight = headerHeightMediumPx;
    } else {
      this._scrollHeight = headerHeightSmallPx;
    }
    this._onScroll();
  }

  private _onScroll() {
    if (this.state.isFixed && window.scrollY < this._scrollHeight) {
      this.setState({
        isFixed: false
      });
    } else if (!this.state.isFixed && window.scrollY >= this._scrollHeight) {
      this.setState({
        isFixed: true
      });
    }
  }

  componentDidMount() {
    if (!isBrowserEnv) {
      return;
    }
    this._mq = window.matchMedia(`(min-width: ${breakpoints.small})`);

    this._mq.addListener(this._onMediaChange);

    this._onMediaChange(this._mq);

    window.addEventListener('scroll', this._onScroll);
  }

  componentWillUnmount() {
    if (!isBrowserEnv) {
      return;
    }

    window.removeEventListener('scroll', this._onScroll);

    if (this._mq) {
      this._mq.removeListener(this._onMediaChange);
    }
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
