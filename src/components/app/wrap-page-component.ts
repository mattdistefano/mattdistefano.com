import { ComponentType } from 'react';

import { NotFoundPageComponent } from '../pages';

import {
  withFadeIn,
  WithFadeInProps,
  withRouteOnEnter,
  withNotFound,
  WithNotFoundProps,
  WithRouteOnEnterProps
} from '../hocs';

export interface WrappedProps
  extends WithNotFoundProps,
    WithFadeInProps,
    WithRouteOnEnterProps {}

export const wrapPageComponent = <TProps extends {}>(
  component: ComponentType<TProps>
): ComponentType<WrappedProps & TProps> =>
  withRouteOnEnter(withFadeIn(withNotFound(NotFoundPageComponent, component)));
