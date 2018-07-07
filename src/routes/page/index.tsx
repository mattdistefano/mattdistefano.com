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
  const page = props.pageCache && props.pageCache[props.url] && props.pageCache[props.url].data;

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

PageRouteComponent['__load'] = true;
