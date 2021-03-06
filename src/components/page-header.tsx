import { h, Component } from 'preact';
import { DateComponent } from './date';

export interface PageHeaderProps {
  title?: string;
  summary?: string;
  created?: string;
  modified?: string;
  class?: string;
}

interface PageTitleProps {
  title?: string;
}

interface PageSummaryProps {
  summary?: string;
}

interface PageDateProps {
  date?: string;
  label?: string;
  class?: string;
}

// tslint:disable-next-line:variable-name
const PageHeaderSummaryComponent = (props: PageSummaryProps) => {
  if (!props.summary) {
    return null;
  }

  const summaryHtml = { __html: props.summary };

  return <p class="page-header__summary" dangerouslySetInnerHTML={summaryHtml}></p>;
};

// tslint:disable-next-line:variable-name
const PageHeaderDateComponent = (props: PageDateProps) => {
  if (!props.date) {
    return null;
  }

  const label = props.label ? `${props.label} :` : '';

  return <div class={`page-header__date ${props.class || ''}`}>
    {label} <DateComponent date={props.date} class="page-header__time" />
  </div>;
};

class PageTitleComponent extends Component<PageTitleProps> {
  private ref: HTMLHeadingElement;

  constructor() {
    super();

    this.trackRef = this.trackRef.bind(this);
  }

  private trackRef(elem: HTMLHeadingElement) {
    this.ref = elem;
  }

  componentDidMount() {
    this.ref && this.ref.focus();
  }

  render(props: PageTitleProps) {
    const titleHtml = { __html: props.title };

    return (
      <h1 class="page-header__title" tabIndex={-1} ref={this.trackRef} dangerouslySetInnerHTML={titleHtml}></h1>
    );
  }
}


// tslint:disable-next-line:variable-name
export const PageHeaderComponent = (props: PageHeaderProps) => {
  if (!props.title) {
    return null;
  }

  return (
    <div class={`page-header ${props.class || ''}`}>
      <div class="container animation-slide-fade-in animation-delay-1">
        <PageTitleComponent title={props.title} />
        <PageHeaderSummaryComponent summary={props.summary} />
        <PageHeaderDateComponent label="Published" date={props.created} />
      </div>
    </div>
  );
};
