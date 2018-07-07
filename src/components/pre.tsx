import { h, Component, ComponentChildren } from 'preact';

export interface PreProps {
  children?: ComponentChildren;
}

interface PreState {
  expanded: boolean;
}

// tslint:disable-next-line:variable-name
export class PreComponent extends Component<PreProps, PreState> {
  constructor(props: PreProps) {
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

  render(props: PreProps) {
    return <div class={ `pre ${this.state.expanded ? 'full-bleed' : ''}` }>
      <pre class="pre__inner">{...props.children}</pre>
      <button type="button" class="btn btn--link btn--link-inline pre__expand" onClick={this.onExpandClick}>
        {this.state.expanded ? 'Collapse' : 'Expand'}
      </button>
    </div>
  }
};
