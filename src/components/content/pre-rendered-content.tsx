import * as React from 'react';
import * as PropTypes from 'prop-types';
import { RouterChildContext } from 'react-router';
import { Link } from 'react-router-dom';

export interface PreRenderedContentProps {
  html?: string;
  className?: string;
}

const isModifiedEvent = (e: MouseEvent) =>
  !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);

const nearestAnchor = (elem: HTMLElement) => {
  let candidate = elem;

  while (candidate && candidate.tagName !== 'A') {
    candidate = candidate.parentElement;
  }

  return candidate as HTMLAnchorElement;
};

const isSameDomain = (anchor: HTMLAnchorElement) =>
  anchor &&
  window &&
  window.location &&
  anchor.protocol === window.location.protocol &&
  anchor.host === window.location.host;

// tslint:disable-next-line:variable-name
export class PreRenderedContentComponent extends React.Component<
  PreRenderedContentProps,
  {}
> {
  private _elem: HTMLElement;

  constructor(props: PreRenderedContentProps, context: RouterChildContext<{}>) {
    super(props, context);

    this._onClick = this._onClick.bind(this);
    this._onRef = this._onRef.bind(this);
  }

  _onClick(e: MouseEvent) {
    if (e.defaultPrevented || e.button !== 0 || isModifiedEvent(e)) {
      return;
    }

    const anchor = nearestAnchor(e.target as HTMLElement);

    if (
      !anchor ||
      (anchor.target && anchor.target !== '_self') ||
      !isSameDomain(anchor)
    ) {
      return;
    }

    e.preventDefault();

    this.context.router.history.push({
      pathname: anchor.pathname,
      search: anchor.search
    });
  }

  _onRef(elem: HTMLElement) {
    this._elem = elem;
  }

  componentDidMount() {
    if (this._elem) {
      this._elem.addEventListener('click', this._onClick);
    }
  }

  componentWillUnmount() {
    if (this._elem) {
      this._elem.removeEventListener('click', this._onClick);
    }
  }

  render() {
    const html = { __html: this.props.html };

    return (
      <div
        className={this.props.className}
        dangerouslySetInnerHTML={html}
        ref={this._onRef}
      />
    );
  }

  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired,
        createHref: PropTypes.func.isRequired
      }).isRequired
    }).isRequired
  };
}
