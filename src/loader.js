const yaml = require('js-yaml');
const { getOptions } = require('loader-utils');
const memoize = require('lodash/memoize');
const createMarkdownType = require('./types/MarkdownType');

const createYamlSchema = memoize((options = {}) => yaml.Schema.create(yaml.DEFAULT_SAFE_SCHEMA, [
  createMarkdownType(options.markdown),
]));

module.exports = function yaml2json(source) {
  if (this.cacheable) {
    this.cacheable();
  }

  const { safe, ...options } = getOptions(this) || {};
  const load = safe !== false ? 'safeLoad' : 'load';

  try {
    const result = yaml[load](source, { schema: createYamlSchema(options) });
    return JSON.stringify(result, null, '\t');
  } catch (err) {
    this.emitError(err);
    return null;
  }
};
