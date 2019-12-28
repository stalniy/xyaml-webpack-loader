const Markdown = require('markdown-it');
const namedHeadings = require('markdown-it-named-headings');
const attrs = require('markdown-it-attrs')

module.exports = new Markdown({ html: true })
  .use(namedHeadings)
  .use(attrs);
