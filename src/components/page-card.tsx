import * as React from 'react';
import { Link } from 'react-router-dom';
import { PageSummary } from '../models';
import { formatDate } from '../utils/format-date';

export interface PageCardProps {
  page?: PageSummary;
  className?: string;
}

// tslint:disable-next-line:variable-name
export const PageCardComponent = (props: PageCardProps) =>
  <Link className={`page-card ${props.className || ''}`} to={props.page.path}>
    <time dateTime={props.page.created} className="page-card__date">{formatDate(props.page.created)}</time>
    <div className="page-card__title">
      {props.page.title}
    </div>
    <p className="page-card__summary">
      {props.page.summary}
    </p>
  </Link>;
