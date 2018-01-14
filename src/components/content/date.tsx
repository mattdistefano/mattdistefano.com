import * as React from 'react';

import { formatDate } from '../../utils';

export interface DateProps {
  date: string;
  className?: string;
}

// tslint:disable-next-line:variable-name
export const DateComponent = (props: DateProps) => {
  // TODO should handle this on data load instead 
  const date = new Date(props.date);

  const isValid = !isNaN(date.getTime());

  return isValid ? (
    <time dateTime={props.date} className={`date ${props.className}`}>
      {formatDate(props.date, false)}
    </time>
  ) : null;
};
