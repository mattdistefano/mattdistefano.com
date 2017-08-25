import * as React from 'react';
import { Component, ComponentType } from 'react';

export interface WithFadeInProps {
  animDelay?: number;
  animKey: string;
}

export const withFadeIn = <TProps extends {}>(
  // tslint:disable:variable-name
  Wrapped: ComponentType<TProps>
  // tslint:enable:variable-name
) => {
  type WithFadeInPropTypes = TProps & WithFadeInProps;

  class WithFadeInComponent extends Component<WithFadeInPropTypes> {
    render() {
      const delayClassName = this.props.animDelay
        ? `animation-delay-${this.props.animDelay}`
        : '';
      return (
        <div
          key={this.props.animKey}
          className={`animation-fade-in ${delayClassName}`}
        >
          <Wrapped {...this.props} />
        </div>
      );
    }
  }

  return WithFadeInComponent;
};
