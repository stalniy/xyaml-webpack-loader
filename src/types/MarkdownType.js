import { defineScalarTag } from 'js-yaml';

function isSingleParagraph(html) {
  return html.startsWith('<p>') && html.endsWith('</p>') && html.indexOf('<p>', 3) === -1;
}

export default function createYamlType(parser) {
  return defineScalarTag('!md', {
    identify: () => false,
    resolve(value) {
      const parsed = parser.render(value).trim();
      return isSingleParagraph(parsed) ? parsed.slice(3, -4) : parsed;
    },
  });
}
