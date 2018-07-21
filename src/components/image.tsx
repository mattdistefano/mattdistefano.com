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
  // TODO lazy-load
  // TODO re-implement expand when scaled dimensions < native dimensions && scaled dimensions < vh/vw

  return <figure class="figure">
    <img {...props} class="figure__img" />
    <figcaption class="figure__caption">
      <a class="link-muted image__link" href={props.src} target="_blank">
        {props.alt}
        <span class="sr-only">(Download)</span>
      </a>
    </figcaption>
  </figure>
};
