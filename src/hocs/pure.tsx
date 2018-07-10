import { h, ComponentFactory, RenderableProps, Component } from 'preact';

function shallowEqual(a, b) {
  for (let key in a) if (a[key] !== b[key]) return false;
  for (let key in b) if (!(key in a)) return false;
  return true;
}

export const withPure = <TProps extends {}>(
  // tslint:disable:variable-name
  Wrapped: ComponentFactory<TProps>,
  // tslint:enable:variable-name
) => class WrappedPureComponent extends Component<TProps> {
  shouldComponentUpdate(props, state) {
    return !(shallowEqual(props, this.props) && shallowEqual(state, this.state));
  }

  render(props: RenderableProps<TProps>, state: any) {
    return <Wrapped {...props} {...state} />
  }
}

// TODO do this as abstract class instead?
