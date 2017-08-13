import * as React from 'react';
import { IndexPage, AsyncData } from '../../models';
import { PageCardListComponent } from '../content';

export interface StandardIndexPageProps {
  page?: AsyncData<IndexPage>;
}

// tslint:disable-next-line:variable-name
export const StandardIndexPageComponent = (props: StandardIndexPageProps) =>
  <div className="standard-index-page">
    <PageCardListComponent
      pages={props.page && props.page.data && props.page.data.pages}
    />
  </div>;
