import * as React from 'react';
import { Link } from 'react-router-dom';
import { Page } from '@mattdistefano/site-generator';
import { StaticContentComponent } from './static-content';
import { PageHeaderComponent } from './page-header';

export interface PageContentProps {
  title?: string;
  summary?: string;
  created?: string;
  modified?: string;
  bannerUrl?: string;
  bannerAlt?: string;
  content?: string;
  className?: string;
  children?: JSX.Element;
}

// tslint:disable-next-line:variable-name
export const PageContentComponent = (props: PageContentProps) => {
  if (!props.title) {
    return <div>{props.children}</div>;
  }

  const content = props.content ? (
    <StaticContentComponent
      className="page-content container animation-slide-fade-in animation-delay-2"
      html={props.content}
    />
  ) : null;

  return (
    <div className={`page ${props.className || ''}`}>
      <PageHeaderComponent
        title={props.title}
        summary={props.summary}
        created={props.created}
        modified={props.modified} />
      {content}
      {props.children}
    </div>
  );
};
