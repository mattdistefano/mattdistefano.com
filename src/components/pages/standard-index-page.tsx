import * as React from 'react';
import { IndexPage, AsyncData } from '../../models';
import { PageCardListComponent } from '../page-card-list';

export interface StandardIndexPageProps {
  page: AsyncData<IndexPage>;
}

export const StandardIndexPageComponent = (props: StandardIndexPageProps) =>
  <div className="standard-index-page">
    <PageCardListComponent
      pages={props.page && props.page.data && props.page.data.pages}
    />
  </div>;
