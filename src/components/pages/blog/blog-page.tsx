import * as React from 'react';
import { Page, AsyncData } from '../../../models';
import { PageContentComponent } from '../../page-content';
import { PageFooterComponent } from '../../page-footer';

export interface BlogPageProps {
  page?: AsyncData<Page>;
}

// tslint:disable-next-line:variable-name
export const BlogPageComponent = (props: BlogPageProps) => {
  const page = props.page && props.page.data;

  if (!page) {
    return <div>Loading!</div>;
  }

  return (
    <div className="blog-page">
      <PageContentComponent title={page.titleHtml} content={page.content} date={page.created} />
      <PageFooterComponent page={props.page && props.page.data} />
    </div>
  );
};
