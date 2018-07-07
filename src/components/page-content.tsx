import { h } from 'preact';
import { MarkupComponent } from './markup';
import { PageHeaderComponent } from './page-header';
import { ImageComponent } from './image';

export interface PageContentProps {
  title?: string;
  summary?: string;
  created?: string;
  modified?: string;
  content?: string;
  class?: string;
  children?: JSX.Element;
}

const components = {
  img: ImageComponent,
};

// tslint:disable-next-line:variable-name
export const PageContentComponent = (props: PageContentProps) => {
  if (!props.title) {
    return <div>{props.children}</div>;
  }

  // TODO support server-side rendering
  const content = props.content ? (
    <MarkupComponent
      class="page-content container animation-slide-fade-in animation-delay-2"
      markup={props.content} />
  ) : null;

  return (
    <div class={`page ${props.class || ''}`}>
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
