import * as React from 'react';
import { Component, ComponentType } from 'react';
import { AsyncData, Page, IndexPage, PageSummary } from '../../models';

export interface WithNotFoundProps {
  page: AsyncData<Page | IndexPage | PageSummary>;
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
      return this.props.page && this.props.page.status !== 'notfound'
        ? <Wrapped {...this.props} />
        : <NotFound />;
    }
  }

  return WithNotFoundComponent;
};
