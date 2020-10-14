const yaml = require('js-yaml');
const memoize = require('lodash/memoize');
const createMarkdownType = require('./types/MarkdownType');
const createMdParser = require('./services/markdown');

const getOrCreateMdParser = memoize(createMdParser);
const createYamlSchema = memoize((options = {}) => {
  const types = [];

  if (options.markdown !== false) {
    const md = options.markdown || {};
    const parser = md.parser || getOrCreateMdParser(md);
    types.push(createMarkdownType(parser));
  }

  return yaml.Schema.create(yaml.DEFAULT_SAFE_SCHEMA, types);
});

function parse(source, { safe, ...options } = {}) {
  const load = safe !== false ? yaml.safeLoad : yaml.load;

  return load(source, { schema: createYamlSchema(options) });
}

module.exports = {
  createYamlSchema,
  createMarkdownType,
  getOrCreateMdParser,
  parse
};
