import { h, ComponentFactory, RenderableProps } from 'preact';

/**
 * Hacky HOC to force preact to rebuild the dom when the specified prop key changes.
 * Useful for rerunning animations on a route change
 */
export const withCleanDom = <TProps extends {}>(
  // tslint:disable:variable-name
  Wrapped: ComponentFactory<TProps>,
  propKey: string,
  // tslint:enable:variable-name
) => (props: RenderableProps<TProps>) => <div>
    <div key={props[propKey]}>
      <Wrapped {...props} />
    </div>
  </div>;
