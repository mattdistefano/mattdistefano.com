import * as React from 'react';
import { Link } from 'react-router-dom';
import { Page } from '../models';
import { PageFooterComponent } from './page-footer';
import { formatDate } from '../utils/format-date';

export interface PageContentProps {
  page?: Page;
}

export const PageContentComponent = (props: PageContentProps) => {
  const page = props.page;

  if (!page) {
    return <div>Loading!</div>;
  }

  const title = { __html: page && page.titleHtml };
  const content = { __html: page && page.content };

  return (
    <div className="page-content fade-in">
      <header>
        <time className="page-content__date" dateTime={page.created}>
          {formatDate(page.created)}
        </time>
        <h1 className="page-content__title" dangerouslySetInnerHTML={title} />
      </header>
      <div className="page-content__body" dangerouslySetInnerHTML={content} />
    </div>
  );
};
