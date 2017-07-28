module.exports = html => {
  let text = '';
  let inTag = false;

  for (let i = 0; i < html.length; i++) {
    if (html[i] === '<') {
      inTag = true;
    } else if (html[i] === '>') {
      inTag = false;
    } else if (!inTag) {
      text += html[i];
    }
  }

  return text;
};
