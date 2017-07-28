const htmlToText = require('./html-to-text');

module.exports = (html) => {
  if (!html) {
    return {};
  }

  // regex *could* work too but this is simpler
  const titleStart = html.indexOf('<h1>');
  const titleEnd = html.indexOf('</h1>');

  // no title? no problem  
  if (titleStart === -1 || titleEnd === -1) {
    return {};
  }

  // get the inner portion of the title, not including the surrounding tag pair  
  const titleHtml = html.slice(titleStart + 4, titleEnd);
  // remove the title, including the surrounding tag pair, from the containing html
  html = html.slice(0, titleStart) + html.slice(titleEnd + 5);

  // convert title html to plain text  
  const titleText = htmlToText(titleHtml);

  return {
    titleHtml, titleText, html
  }
};