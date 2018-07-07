import { h } from 'preact';
import { RoutableProps } from 'preact-router';
import { Page, PageSummary, IndexPage } from '@mattdistefano/site-generator';
import { AsyncData, PageCache } from '../../models';
import {
  PageFooterComponent,
  PageCardListComponent,
  PageContentComponent,
  QueriesComponent
} from '../../components';

export interface PageRouteProps extends RoutableProps {
  pageCache?: PageCache;
  url?: string;
}

// tslint:disable-next-line:variable-name
export const PageRouteComponent = (props: PageRouteProps) => {
  const cached = props.pageCache && props.pageCache[props.url];

  const page = cached && cached.data;

  const type = page && page.type;

  // TODO consolidate this into a HOC
  if (!cached || cached.status === 'loading' || type === 'summary') {
    return <div class="page-content container animation-fade-in animation-delay-1">Loading!</div>;
  }

  if (cached.status === 'notfound') {
    return <div class="page-content container animation-fade-in">
      <h1>Ugh.</h1>
      <p>It's broken. Maybe try again later or refresh or back or something.</p>
    </div>
  }

  const pageCardList =
    page.type === 'index' ? <PageCardListComponent pages={page.pages} /> : null;

  const queries =
    page.type === 'index' ? <QueriesComponent queries={page.queries} /> : null;

  const footer =
    page.type === 'page' ? <PageFooterComponent page={page} /> : null;

  return (
    <PageContentComponent
      title={page.title}
      summary={page.summary}
      content={page.type !== 'summary' ? page.content : null}
      created={page.created}
      modified={page.modified}
    >
      {footer}
      {pageCardList}
      {queries}
    </PageContentComponent>
  );
};
