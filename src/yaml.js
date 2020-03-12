const yaml = require('js-yaml');
const memoize = require('lodash/memoize');
const createMarkdownType = require('./types/MarkdownType');
const createMdParser = require('./services/markdown');

const getOrCreateMdParser = memoize(createMdParser);
const createYamlSchema = memoize((options = {}) => yaml.Schema.create(yaml.DEFAULT_SAFE_SCHEMA, [
  createMarkdownType(getOrCreateMdParser(options.markdown)),
]));

function parse(source, { safe, ...options } = {}) {
  const load = safe !== false ? 'safeLoad' : 'load';
  return yaml[load](source, { schema: createYamlSchema(options) });
}

module.exports = {
  createYamlSchema,
  createMarkdownType,
  getOrCreateMdParser,
  parse
};
