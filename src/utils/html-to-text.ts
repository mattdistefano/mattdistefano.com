export default (html: string) => {
  let text = '';
  let inTag = false;

  for (const char of html) {
    if (char === '<') {
      inTag = true;
    } else if (char === '>') {
      inTag = false;
    } else if (!inTag) {
      text += char;
    }
  }

  return text;
};
