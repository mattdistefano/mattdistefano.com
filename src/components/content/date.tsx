import * as React from 'react';

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export interface DateProps {
  date: string;
  className?: string;
}

// tslint:disable-next-line:variable-name
export const DateComponent = (props: DateProps) => {
  const date = new Date(props.date);

  const isValid = !isNaN(date.getTime());

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = `${date.getFullYear()}`.slice(-2);

  return isValid ? (
    <time dateTime={props.date} className={`date ${props.className}`}>
      {day} {month} '{year}
    </time>
  ) : null;
};
