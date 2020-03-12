const Markdown = require('markdown-it');

module.exports = function createMdParser(options = {}) {
  const parser = new Markdown({ html: true });
  const extensions = {
    'markdown-it-named-headings': {},
    'markdown-it-attrs': { leftDelimiter: '@{' },
    ...options.use,
  };

  Object.keys(extensions).forEach((extName) => {
    const extOptions = extensions[extName];

    if (extOptions !== false) {
      const extension = require(extName); // eslint-disable-line
      parser.use(extension, extOptions);
    }
  });

  return parser;
};
