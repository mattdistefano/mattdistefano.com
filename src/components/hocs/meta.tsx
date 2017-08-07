import * as React from 'react';
import { Component, ComponentType } from 'react';
import isBrowserEnv from '../../utils/is-browser-env';

export interface WithMetaProps {
  title: string;
  description: string;
}

// TODO just use react helmet?
export const withMeta = <TProps extends {}>(
  // tslint:disable-next-line:variable-name
  Wrapped: ComponentType<TProps>
) => {
  type WithMetaPropTypes = TProps & WithMetaProps;

  class WithMetaComponent extends Component<WithMetaPropTypes> {
    private _description: HTMLMetaElement;

    private _initDescription() {
      if (!isBrowserEnv) {
        return;
      }

      let desc = document.head.querySelector(
        'meta[name="description"]'
      ) as HTMLMetaElement;

      if (!desc) {
        desc = document.createElement('meta');
        desc.setAttribute('name', 'description');
        document.head.appendChild(desc);
      }
      this._description = desc;
    }

    private _setMeta(title: string, description: string) {
      if (!this._description) {
        return;
      }

      document.title = title;
      this._description.innerText = description;
    }

    private _hasChanges(nextProps: Readonly<WithMetaPropTypes>) {
      return (
        nextProps.title !== this.props.title ||
        nextProps.description !== this.props.description
      );
    }

    componentDidMount() {
      this._initDescription();
      this._setMeta(this.props.title, this.props.description);
    }

    componentWillReceiveProps(nextProps: Readonly<WithMetaPropTypes>) {
      if (this._hasChanges(nextProps)) {
        this._setMeta(nextProps.title, nextProps.description);
      }
    }

    render() {
      return <Wrapped {...this.props} />;
    }
  }

  return WithMetaComponent;
};
