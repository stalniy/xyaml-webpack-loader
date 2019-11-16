const Markdown = require('markdown-it');
const namedHeadings = require('markdown-it-named-headings');
const yaml = require('js-yaml');

function isSingleParagraph(html) {
  return html.startsWith('<p>') && html.endsWith('</p>') && html.indexOf('<p>', 3) === -1;
}

function cleanHtml(html) {
  return html.trim().replace(/>[\n\r]+</g, '><');
}

const parser = new Markdown({ html: true })
  .use(namedHeadings);

module.exports = new yaml.Type('!md', {
  kind: 'scalar',
  construct(value) {
    const parsed = value === null ? '' : cleanHtml(parser.render(value));
    return isSingleParagraph(parsed) ? parsed.slice(3, -4) : parsed;
  },
});
