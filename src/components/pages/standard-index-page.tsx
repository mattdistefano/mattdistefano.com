import * as React from 'react';
import { IndexPage, PageSummary, AsyncData } from '../../models';
import { PageCardListComponent, PageContentComponent } from '../content';

export interface StandardIndexPageProps {
  page?: AsyncData<IndexPage | PageSummary>;
}

// tslint:disable-next-line:variable-name
export const StandardIndexPageComponent = (props: StandardIndexPageProps) => {
  const page = props.page && props.page.data;

  if (!page) {
    return <div>Loading!</div>;
  }

  return (
    <div className="standard-index-page">
      <PageContentComponent
        title={page.titleHtml}
        content={page.type === 'index' ? page.content : null}
      />
      <PageCardListComponent pages={page.pages} />
    </div>
  );
};
