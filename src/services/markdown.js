const Markdown = require('markdown-it');

const DEFAULT_PLUGINS = {
  'markdown-it-headinganchor': {},
  'markdown-it-attrs': { leftDelimiter: '@{' },
};

function applyPlugins(md, plugins) {
  const allPlugins = { ...DEFAULT_PLUGINS, ...plugins };

  Object.keys(allPlugins).forEach((name) => {
    const options = allPlugins[name];

    if (options === false) {
      return;
    }

    const plugin = require(name); // eslint-disable-line

    if (options === true) {
      md.use(plugin);
    } else if (Array.isArray(options)) {
      md.use(plugin, ...options);
    } else {
      md.use(plugin, options);
    }
  });
}

module.exports = function createMdParser(options = {}) {
  const parser = new Markdown({ html: true });

  if (typeof options.use === 'function') {
    options.use(parser, applyPlugins);
  } else {
    applyPlugins(parser, options.use);
  }

  return parser;
};
