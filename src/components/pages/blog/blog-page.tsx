import * as React from 'react';
import { Page, PageSummary, AsyncData } from '../../../models';
import { PageContentComponent, PageFooterComponent } from '../../content';

export interface BlogPageProps {
  page?: AsyncData<Page | PageSummary>;
}

// tslint:disable-next-line:variable-name
export const BlogPageComponent = (props: BlogPageProps) => {
  const page = props.page && props.page.data;

  if (!page) {
    return <div>Loading!</div>;
  }

  return (
    <div className="blog-page content-container">
      <PageContentComponent
        title={page.title}
        content={page.type === 'page' ? page.content : null}
        date={page.created}
      />
      <PageFooterComponent page={page.type === 'page' ? page : null} />
    </div>
  );
};
