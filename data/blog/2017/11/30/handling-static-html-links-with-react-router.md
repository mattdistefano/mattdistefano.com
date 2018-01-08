---
created: November 30, 2017
summary: A walk-through of enabling react-router to handle static HTML links.
---

# Handling static HTML links with react-router

I use markdown to author content for this site, which means that a significant chunk of the page content is actually static HTML inserted via `dangerouslySetInnerHTML` rather than being coded as JSX.

This is fine for the most part --- there's not much behavior required within the pages and the global styling defaults cover most typographical needs.

The one thing that doesn't work quite right in this scenario, however, is linking to other pages within the site. It technically does work --- clicking a link _does_ take you to that page --- but the transition is not handled via react-router, so we lose the benefits of client-side routing.

## Why doesn't it just work?

When using react-router, links to other routes are typically declared via the `Link` component. The `Link` in turn renders an `<a href=""></a>`. So far, this is consistent w/ our static HTML. The catch is that `Link` also attaches a click handler to the rendered `a`. This click handler intercepts clicks on the `a`, stops the browser navigation (via `event.preventDefault()`), and performs a push or replace via the browser history API (abstracted behind the router's history library).

The intent here is that when you want to link to a _route_, you use `Link`, but if you need to link to another page/file on the site that's _not_ a route, you can just create a plain old `<a href={url}></a>`. In other words, you have to _opt-in_ to the client-side routing behavior on a _per-link_ basis.

## How do we fix it?

In this case, I want to be able to opt-in at a higher level in the DOM --- namely, the element containing my static HTML. And I want to apply some hueristics to automatically determine whether the link should be handled via react-router or not.

Thankfully, the solution is fairly simple --- just reproduce `Link`'s click handler using delegation and add some extra logic to capture only links that look like they're for another page.

## Creating the component

Since I'm anticipating adding some other functionality down the road, I opted to create a general-purpose `StaticContentComponent`, but this could certainly be implemented in a more narrowly-scoped fashion, as a HOC, or even within the root `App` component.

### Scaffolding the initial component

```typescript
import * as React from 'react';

export interface StaticContentProps {
  html?: string;
  className?: string;
}

export class StaticContentComponent extends React.Component<
  StaticContentProps
> {
  constructor(props: StaticContentProps) {
    super(props);
  }

  render() {
    const html = { __html: this.props.html };

    return (
      <div className={this.props.className} dangerouslySetInnerHTML={html} />
    );
  }
}
```

This covers the basic scaffolding for the component.

### Obtaining a reference to the router instance

Next, because the react-router instance is passed on `context`, we need to add `context` to the component. The react-router typescript defs provide a handy RouterChildContext typing for the `context` object, and `prop-types` is used to define the static `contextTypes`.

```typescript
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { RouterChildContext } from 'react-router';

export interface StaticContentProps {
  html?: string;
  className?: string;
}

export class StaticContentComponent extends React.Component<
  StaticContentProps
> {
  constructor(props: StaticContentProps, context: RouterChildContext<{}>) {
    super(props, context);
  }

  render() {
    const html = { __html: this.props.html };

    return (
      <div className={this.props.className} dangerouslySetInnerHTML={html} />
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
```

The router instance now can be referenced as `this.context.router`.

### Adding a click handler

The click handler itself can be plumbed through React's event system. Note that it is defined as an arrow function to ensure `this` is bound to the component instance.

```typescript
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { RouterChildContext } from 'react-router';

export interface StaticContentProps {
  html?: string;
  className?: string;
}

export class StaticContentComponent extends React.Component<
  StaticContentProps
> {
  constructor(props: StaticContentProps, context: RouterChildContext<{}>) {
    super(props, context);
  }

  private _onClick = (e: React.MouseEvent<HTMLDivElement>) => {};

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
```

### Intercept only clicks on links to other pages

The intent is to intercept only certain types of clicks:

1. The click must be with the left mouse button
2. The click must not occur while a modifier key is being pressed
3. The event's default action must not have been prevented already
4. The click must be on a `a` or a descendant of an `a`

And then only on certain types of links:

1. The `a` must not open in a new tab/window
2. The `a` must link to a page on the same domain
3. The `a` must not have a file extension (under the assumption that a URL w/ an extension is a file meant for download)

```typescript
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

    // will only get here if all criteria are met
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
```

### Routing via react-router

Finally, use the router reference from `context` to initiate a client-side transition to the new URL.

```typescript
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
```

Now the component can be used as `<StaticContentComponent html={htmlContent} />` and will both render the static HTML and handle link clicks as desired.
