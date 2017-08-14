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
      // TODO need to support server-rendering too
      // can maybe accomplish by swapping CSSTransitionGroup for a div w/ our own animation class
      // or maybe just write our own animation wrapper?
      return (
        <CSSTransitionGroup
          transitionName="transition-fade-in"
          transitionAppearTimeout={900}
          transitionEnterTimeout={900}
          transitionEnter={true}
          transitionLeave={false}
          transitionAppear={true}
          component="div"
        >
          <div
            key={this.props.key}
            className={
              this.props.delay ? `transition-delay-${this.props.delay}` : ''
            }
          >
            <Wrapped {...this.props} />
          </div>
        </CSSTransitionGroup>
      );
    }
  }

  return WithFadeInComponent;
};
