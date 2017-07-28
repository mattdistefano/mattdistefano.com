import * as React from 'react';
import { Component, ComponentType } from 'react';

export interface WithNotFoundProps {
  found: boolean;
}

export const withNotFound = <TProps extends {}>(
  NotFound: ComponentType,
  Wrapped: ComponentType<TProps>
) => {
  type WithNotFoundPropTypes = TProps & WithNotFoundProps;

  class WithNotFoundComponent extends Component<WithNotFoundPropTypes> {
    render() {
      return this.props.found ? <Wrapped {...this.props} /> : <NotFound />;
    }
  }

  return WithNotFoundComponent;
};
