import { h } from 'preact';

export interface ImageProps {
  src?: string;
  alt?: string;
}

// tslint:disable-next-line:variable-name
export const ImageComponent = (props: ImageProps) => {
  if (!props.src) {
    return null;
  }

  // TODO add icon to link
  // TODO open in modal eventually?
  // TODO lazy-load

  return <div class="image">
    <img {...props} class="image__img" />
    <a class="link-muted image__link" href={props.src} target="_blank">Open in new window</a>
  </div>
};
