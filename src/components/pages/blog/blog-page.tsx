import * as React from 'react';
import { Page, AsyncData } from '../../../models';
import { PageContentComponent } from '../../page-content';
import { PageFooterComponent } from '../../page-footer';

export interface BlogPageProps {
  page?: AsyncData<Page>;
}

// tslint:disable-next-line:variable-name
export const BlogPageComponent = (props: BlogPageProps) =>
  <div className="blog-page">
    <PageContentComponent page={props.page && props.page.data} />
    <PageFooterComponent page={props.page && props.page.data} />
  </div>;
