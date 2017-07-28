import { ComponentType } from 'react';

import { NotFoundPageComponent } from '../pages';

import {
  withRouteOnEnter,
  withNotFound,
  withMeta,
  WithMetaProps,
  WithNotFoundProps,
  WithRouteOnEnterProps
} from '../hocs';

export interface WrappedProps
  extends WithMetaProps,
    WithNotFoundProps,
    WithRouteOnEnterProps {}

export const wrapPageComponent = <TProps extends {}>(
  component: ComponentType<TProps>
): ComponentType<WrappedProps & TProps> =>
  withRouteOnEnter(withMeta(withNotFound(NotFoundPageComponent, component)));
