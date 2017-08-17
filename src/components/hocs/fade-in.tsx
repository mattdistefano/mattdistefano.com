import * as React from 'react';
import { Component, ComponentType } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { AsyncData, Page, IndexPage } from '../../models';

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
        ? `transition-delay-${this.props.delay} animation-delay-${this.props.delay}`
        : '';
      return (
        <CSSTransitionGroup
          transitionName="transition-fade-in"
          transitionEnterTimeout={900}
          transitionEnter={true}
          transitionLeave={false}
          component="div"
        >
          <div key={this.props.key} className={`animation-fade-in ${delayClassName}`}>
            <Wrapped {...this.props} />
          </div>
        </CSSTransitionGroup>
      );
    }
  }

  return WithFadeInComponent;
};
