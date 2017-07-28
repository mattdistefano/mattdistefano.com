import * as React from 'react';
import { Page, AsyncData } from '../../models';
import { PageContentComponent } from '../page-content';

export interface StandardPageProps {
  page?: AsyncData<Page>;
}

export const StandardPageComponent = (props: StandardPageProps) =>
  <div className="standard-page">
    <PageContentComponent page={props.page && props.page.data} />
  </div>;
