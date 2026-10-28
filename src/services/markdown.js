import Markdown from 'markdown-it';

function applyPlugins(md, plugins = []) {
  plugins.forEach(([plugin, options]) => {
    if (options === false) {
      return;
    }

    if (options === true) {
      md.use(plugin);
    } else if (Array.isArray(options)) {
      md.use(plugin, ...options);
    } else {
      md.use(plugin, options);
    }
  });
}

export default function createMdParser(options = {}) {
  const parser = new Markdown({ html: true });

  if (typeof options.use === 'function') {
    options.use(parser, applyPlugins);
  } else {
    applyPlugins(parser, options.use);
  }

  return parser;
}
