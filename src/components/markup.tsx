import { h } from 'preact';
import Markup from 'preact-markup';
import { ImageComponent } from './image';

export interface MarkupProps {
  markup?: string;
  class?: string;
}

const components = {
  img: ImageComponent,
};

// tslint:disable-next-line:variable-name
export const MarkupComponent = (props: MarkupProps) => {
  if (!props.markup) {
    return null;
  }

  // TODO support server-side rendering
  return <Markup
    trim={false}
    components={components}
    type="html"
    class={props.class}
    markup={props.markup} />
};
