import * as React from 'react';
import { Link } from 'react-router-dom';
import { Page } from '../../models';
import { formatDate } from '../../utils/format-date';
import { PageFooterComponent } from './page-footer';

export interface PageContentProps {
  title?: string;
  date?: string;
  content?: string;
}

// tslint:disable-next-line:variable-name
export const PageContentComponent = (props: PageContentProps) => {
  const title = { __html: props.title };
  const content = { __html: props.content };

  const time = props.date
    ? <time className="page-content__date" dateTime={props.date}>
        {formatDate(props.date)}
      </time>
    : null;

  return (
    <div className="page-content fade-in">
      <h1 className="page-content__title">
        {time}
        <div dangerouslySetInnerHTML={title} />
      </h1>
      {content.__html
        ? <div
            className="page-content__body"
            dangerouslySetInnerHTML={content}
          />
        : null}
    </div>
  );
};
