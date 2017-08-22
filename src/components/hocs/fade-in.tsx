import * as React from 'react';
import { Component, ComponentType } from 'react';

export interface WithFadeInProps {
  delay?: number;
  key: string;
}

export const withFadeIn = <TProps extends {}>(
  // tslint:disable:variable-name
  Wrapped: ComponentType<TProps>
  // tslint:enable:variable-name
) => {
  type WithFadeInPropTypes = TProps & WithFadeInProps;

  class WithFadeInComponent extends Component<WithFadeInPropTypes> {
    render() {
      const delayClassName = this.props.delay
        ? `animation-delay-${this.props.delay}`
        : '';
      return (
        <div
          key={this.props.key}
          className={`animation-fade-in ${delayClassName}`}
        >
          <Wrapped {...this.props} />
        </div>
      );
    }
  }

  return WithFadeInComponent;
};
