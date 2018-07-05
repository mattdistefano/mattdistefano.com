// TODO just use a damned lib already

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

export const formatDate = (d: Date | string, includeTime = true) => {
  if (!d) {
    return '';
  }

  if (typeof d === 'string') {
    d = new Date(d);
  }

  // TODO adjust timezone to pacific

  const month = months[d.getMonth()];
  const date = d.getDate();
  const year = d.getFullYear();
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours > 12 ? 'PM' : 'AM';
  const time =
    !includeTime || (hours === 0 && minutes === 0)
      ? ''
      : ` ${hours > 12 ? hours - 12 : hours}:${
          minutes > 9 ? minutes : '0' + minutes
        } ${ampm}`;

  return `${month} ${date}, ${year}${time}`;
};
