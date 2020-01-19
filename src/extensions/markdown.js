const Markdown = require('markdown-it');

module.exports = function createMdParser(options = {}) {
  const parser = new Markdown({ html: true });
  const extensions = options.use || [
    'markdown-it-named-headings',
    ['markdown-it-attrs', { leftDelimiter: '@{' }]
  ];

  extensions.forEach((ext) => {
    const [extName, extOptions] = Array.isArray(ext) ? ext : [ext];
    const extension = require(extName); // eslint-disable-line
    parser.use(extension, extOptions);
  });

  return parser;
};
