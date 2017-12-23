import * as React from 'react';
import { Page, PageSummary, IndexPage } from '@mattdistefano/site-generator';
import { AsyncData } from '../../models';
import {
  PageFooterComponent,
  PageCardListComponent,
  PageContentComponent,
  QueriesComponent
} from '../content';

export interface HomePageProps {
  page?: AsyncData<Page | PageSummary | IndexPage>;
}

// tslint:disable-next-line:variable-name
export const HomePageComponent = (props: HomePageProps) => {
  const page = props.page && props.page.data;

  if (!page || page.type === 'summary') {
    return <div className="container">Loading!</div>;
  }

  const queriesClone = { ...page.queries };

  const mostRecentPost =
    queriesClone['Most recent blog post'] &&
    (queriesClone['Most recent blog post'].results[0] as Page);

  delete queriesClone['Most recent blog post'];

  const queries =
    page.type === 'index' ? <QueriesComponent queries={queriesClone} /> : null;

  const footer =
    page.type === 'page' ? <PageFooterComponent page={mostRecentPost} /> : null;

  return (
    <div className="standard-page container">
      <PageContentComponent
        title={mostRecentPost.title}
        summary={mostRecentPost.summary}
        content={mostRecentPost.content}
        date={mostRecentPost.created}
        bannerUrl={mostRecentPost.bannerUrl}
        bannerAlt={mostRecentPost.bannerAlt}
      >
        {footer}
      </PageContentComponent>
      {queries}
    </div>
  );
};
