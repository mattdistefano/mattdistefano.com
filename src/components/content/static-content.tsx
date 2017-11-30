import * as React from 'react';
import * as PropTypes from 'prop-types';
import { RouterChildContext } from 'react-router';

export interface StaticContentProps {
  html?: string;
  className?: string;
}

const isModifiedEvent = (e: React.MouseEvent<any>) =>
  !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);

const getNearest = (
  branch: HTMLElement,
  root: HTMLElement,
  tagName: string
) => {
  let candidate = branch;

  while (candidate && candidate.tagName !== tagName) {
    candidate =
      candidate.parentElement === root ? null : candidate.parentElement;
  }

  return candidate as HTMLAnchorElement;
};

const hasTarget = (anchor: HTMLAnchorElement) =>
  anchor.target && anchor.target !== '_self';

const isSameDomain = (anchor: HTMLAnchorElement) =>
  anchor &&
  window &&
  window.location &&
  anchor.protocol === window.location.protocol &&
  anchor.host === window.location.host;

const fileRegex = /\.[a-zA-Z0-9]{2,4}$/;

const isProbablyFile = (anchor: HTMLAnchorElement) =>
  anchor && anchor.pathname && fileRegex.test(anchor.pathname);

const isClientRoutable = (anchor: HTMLAnchorElement) =>
  anchor &&
  isSameDomain(anchor) &&
  !hasTarget(anchor) &&
  !isProbablyFile(anchor);

// tslint:disable-next-line:variable-name
export class StaticContentComponent extends React.Component<
  StaticContentProps
> {
  constructor(props: StaticContentProps, context: RouterChildContext<{}>) {
    super(props, context);
  }

  private _onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.defaultPrevented || e.button !== 0 || isModifiedEvent(e)) {
      return;
    }

    const anchor = getNearest(e.target as HTMLElement, e.currentTarget, 'A');

    if (!isClientRoutable(anchor)) {
      return;
    }

    e.preventDefault();

    this.context.router.history.push({
      pathname: anchor.pathname,
      search: anchor.search
    });
  }

  render() {
    const html = { __html: this.props.html };

    return (
      <div
        className={this.props.className}
        onClick={this._onClick}
        dangerouslySetInnerHTML={html}
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
