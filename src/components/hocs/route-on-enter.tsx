import * as React from 'react';
import { Component, ComponentType } from 'react';

export type onEnterCallback = (routeKey: string) => void;

export interface WithRouteOnEnterProps {
  routeKey: string;
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
      this._onEnter(this.props.routeKey);
    }

    componentWillReceiveProps(nextProps: Readonly<RouteOnEnterPropsType>) {
      if (nextProps.routeKey !== this.props.routeKey) {
        this._onEnter(nextProps.routeKey);
      }
    }

    render() {
      return <Wrapped {...this.props} />;
    }
  }

  return RouteOnEnterComponent;
};
