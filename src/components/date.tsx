import { h } from 'preact';

import { formatDate } from '../utils';

export interface DateProps {
  date: string;
  class?: string;
}

// tslint:disable-next-line:variable-name
export const DateComponent = (props: DateProps) => {
  // TODO should handle this on data load instead
  const date = new Date(props.date);

  const isValid = !isNaN(date.getTime());

  return isValid ? (
    <time dateTime={props.date} class={`date ${props.class}`}>
      {formatDate(props.date, false)}
    </time>
  ) : null;
};
