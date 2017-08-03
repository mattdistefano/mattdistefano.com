import * as React from 'react';
import { Link } from 'react-router-dom';
import { Page } from '../models';
import { PageFooterComponent } from './page-footer';
import { formatDate } from '../utils/format-date';

export interface PageContentProps {
  page?: Page;
  hideDate?: boolean;
}

export const PageContentComponent = (props: PageContentProps) => {
  const page = props.page;

  if (!page) {
    return <div>Loading!</div>;
  }

  const title = { __html: page && page.titleHtml };
  const content = { __html: page && page.content };

  const time = !props.hideDate && page.created
    ? <time className="page-content__date" dateTime={page.created}>
        {formatDate(page.created)}
      </time>
    : null;

  return (
    <div className="page-content fade-in">
      <h1 className="page-content__title">
        {time}
        <div dangerouslySetInnerHTML={title} />
      </h1>
      <div className="page-content__body" dangerouslySetInnerHTML={content} />
    </div>
  );
};
