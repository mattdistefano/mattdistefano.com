import { ComponentType } from 'react';

import { NotFoundPageComponent } from '../pages';

import {
  withRouteOnEnter,
  withNotFound,
  WithNotFoundProps,
  WithRouteOnEnterProps
} from '../hocs';

export interface WrappedProps
  extends WithNotFoundProps,
    WithRouteOnEnterProps {}

export const wrapPageComponent = <TProps extends {}>(
  component: ComponentType<TProps>
): ComponentType<WrappedProps & TProps> =>
  withRouteOnEnter(withNotFound(NotFoundPageComponent, component));
