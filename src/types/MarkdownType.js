const yaml = require('js-yaml');

function isSingleParagraph(html) {
  return html.startsWith('<p>') && html.endsWith('</p>') && html.indexOf('<p>', 3) === -1;
}

module.exports = function createYamlType(parser) {
  return new yaml.Type('!md', {
    kind: 'scalar',
    construct(value) {
      const parsed = value === null ? '' : parser.render(value).trim();
      return isSingleParagraph(parsed) ? parsed.slice(3, -4) : parsed;
    },
  });
};
