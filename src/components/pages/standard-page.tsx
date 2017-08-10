import * as React from 'react';
import { Page, AsyncData } from '../../models';
import { PageContentComponent } from '../page-content';

export interface StandardPageProps {
  page?: AsyncData<Page>;
}

// tslint:disable-next-line:variable-name
export const StandardPageComponent = (props: StandardPageProps) => {
  const page = props.page && props.page.data;

  if (!page) {
    return <div>Loading!</div>;
  }

  return (
    <div className="standard-page">
      <PageContentComponent
        title={page.titleHtml}
        content={page.content}
        date={page.created}
      />
    </div>
  );
};
