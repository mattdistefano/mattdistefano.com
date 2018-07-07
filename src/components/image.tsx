import { h, Component, ComponentChildren } from 'preact';

export interface ImageProps {
  src?: string;
  alt?: string;
}

interface ImageState {
  expanded: boolean;
}

// tslint:disable-next-line:variable-name
export class ImageComponent extends Component<ImageProps, ImageState> {
  constructor(props: ImageProps) {
    super(props);

    this.state = {
      expanded: false,
    };

    this.onExpandClick = this.onExpandClick.bind(this);
  }

  onExpandClick() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  render(props: ImageProps) {
    if (!props.src) {
      return null;
    }
  
    // TODO add icon to link
    // TODO lazy-load
    // TODO only show expand if scaledWidth < nativeWidth

  
    return <div class={ `image ${this.state.expanded ? 'full-bleed' : ''}` }>
      <img {...props} class="image__img" />
      <div class="img__controls">
        <a class="link-muted image__link" href={props.src} target="_blank">Open in new window</a>
        <button type="button" class="btn btn--link btn--link-inline btn--muted image__expand" onClick={this.onExpandClick}>
          {this.state.expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
    </div>
  }
};

