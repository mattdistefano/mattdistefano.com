import * as React from 'react';
import { Page, PageSummary, AsyncData } from '../../models';
import { PageContentComponent } from '../content';

export interface StandardPageProps {
  page?: AsyncData<Page | PageSummary>;
}

// tslint:disable-next-line:variable-name
export const StandardPageComponent = (props: StandardPageProps) => {
  const page = props.page && props.page.data;

  if (!page) {
    return <div>Loading!</div>;
  }

  return (
    <div className="standard-page content-container">
      <PageContentComponent
        title={page.title}
        content={page.type === 'page' ? page.content : null}
        date={page.created}
      />
    </div>
  );
};
