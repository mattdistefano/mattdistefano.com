import { h } from 'preact';
import { RoutableProps } from 'preact-router';
import { PageCache } from '../../models';
import {
  PageFooterComponent,
  PageCardListComponent,
  MarkupComponent,
  PageHeaderComponent,
  QueriesComponent
} from '../../components';

import { withCleanDom } from '../../hocs/clean-dom';

export interface PageRouteProps extends RoutableProps {
  pageCache?: PageCache;
  url?: string;
}

// tslint:disable-next-line:variable-name
const UnWrappedPageRouteComponent = (props: PageRouteProps) => {
  const cached = props.pageCache && props.pageCache[props.url];

  const page = cached && cached.data;

  const type = page && page.type;

  if (cached && cached.status === 'notfound') {
    return <div class="page-content container animation-fade-in">
      <h1>Ugh.</h1>
      <p>It's broken. Maybe try again later or refresh or back or something.</p>
    </div>
  }

  if (!cached || !page) {
    return <div class="page-content container animation-fade-in animation-delay-1">Loading!</div>;
  }

  // TODO better loading state
  const header = <PageHeaderComponent
    title={page.title}
    summary={page.summary}
    created={page.created}
    modified={page.modified} />;

  // TODO support server-side rendering
  const content = page.type !== 'summary' ? (
    <MarkupComponent
      class="page-content container animation-slide-fade-in animation-delay-2"
      markup={page.content} />
  ) : null;

  const pageCardList =
    page.type === 'index' ? <PageCardListComponent pages={page.pages} /> : null;

  const queries =
    page.type === 'index' ? <QueriesComponent queries={page.queries} /> : null;

  const footer =
    page.type === 'page' ? <PageFooterComponent page={page} /> : null;

  return (
    <div class="page">
      {header}
      {content}
      {footer}
      {pageCardList}
      {queries}
    </div>
  );
};

export const PageRouteComponent = withCleanDom<PageRouteProps>(UnWrappedPageRouteComponent, 'url');
