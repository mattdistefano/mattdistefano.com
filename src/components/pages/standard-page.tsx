import * as React from 'react';
import { Page, PageSummary, IndexPage } from '@mattdistefano/site-generator';
import { AsyncData } from '../../models';
import {
  PageFooterComponent,
  PageCardListComponent,
  PageContentComponent,
  QueriesComponent
} from '../content';

export interface StandardPageProps {
  page?: AsyncData<Page | PageSummary | IndexPage>;
}

// tslint:disable-next-line:variable-name
export const StandardPageComponent = (props: StandardPageProps) => {
  const page = props.page && props.page.data;

  if (!page) {
    return <div className="container">Loading!</div>;
  }

  const pageCardList =
    page.type === 'index' ? <PageCardListComponent pages={page.pages} /> : null;

  const queries =
    page.type === 'index' ? <QueriesComponent queries={page.queries} /> : null;

  const footer =
    page.type === 'page' ? <PageFooterComponent page={page} /> : null;

  return (
    <div className="standard-page container">
      <PageContentComponent
        title={page.title}
        summary={page.summary}
        content={page.type !== 'summary' ? page.content : null}
        created={page.created}
        modified={page.modified}
        bannerUrl={page.bannerUrl}
        bannerAlt={page.bannerAlt}
      >
        {footer}
      </PageContentComponent>
      {pageCardList}
      {queries}
    </div>
  );
};
