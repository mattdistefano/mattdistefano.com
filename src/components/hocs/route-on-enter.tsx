import * as React from 'react';
import { Component, ComponentType } from 'react';
import { RouteComponentProps } from 'react-router';

export type onEnterCallback = (url: string) => void;

export interface WithRouteOnEnterProps extends RouteComponentProps<any> {
  onEnter: onEnterCallback;
}

export const withRouteOnEnter = <TProps extends {}>(
  // tslint:disable-next-line:variable-name
  Wrapped: ComponentType<TProps>
) => {
  type RouteOnEnterPropsType = TProps & WithRouteOnEnterProps;

  class RouteOnEnterComponent extends Component<RouteOnEnterPropsType> {
    private _onEnter(routeKey: string) {
      if (typeof this.props.onEnter === 'function') {
        this.props.onEnter(routeKey);
      }
    }

    componentDidMount() {
      this._onEnter(this.props.match.url);
    }

    componentWillReceiveProps(nextProps: Readonly<RouteOnEnterPropsType>) {
      // TODO comparing location works but feels awkward since we're not using it?
      if (nextProps.location !== this.props.location) {
        this._onEnter(nextProps.match.url);
      }
    }

    render() {
      return <Wrapped {...this.props} />;
    }
  }

  return RouteOnEnterComponent;
};
