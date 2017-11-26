import * as React from 'react';

export const months = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec'
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
      <span className="date__day">{day}</span>
      <span className="date__month-year">
        {month} '{year}
      </span>
    </time>
  ) : null;
};
