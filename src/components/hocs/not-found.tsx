import * as React from 'react';
import { Component, ComponentType } from 'react';

export interface WithNotFoundProps {
  found: boolean;
}

export const withNotFound = <TProps extends {}>(
  // tslint:disable:variable-name
  NotFound: ComponentType,
  Wrapped: ComponentType<TProps>
  // tslint:enable:variable-name
) => {
  type WithNotFoundPropTypes = TProps & WithNotFoundProps;

  class WithNotFoundComponent extends Component<WithNotFoundPropTypes> {
    render() {
      return this.props.found ? <Wrapped {...this.props} /> : <NotFound />;
    }
  }

  return WithNotFoundComponent;
};
