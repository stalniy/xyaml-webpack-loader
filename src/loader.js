const yaml = require('js-yaml');
const { getOptions } = require('loader-utils');
const MarkdownType = require('./types/MarkdownType');

const MARKDOWN_SCHEMA = yaml.Schema.create(yaml.DEFAULT_SAFE_SCHEMA, [
  MarkdownType,
]);

module.exports = function yaml2json(source) {
  if (this.cacheable) {
    this.cacheable();
  }

  const options = getOptions(this) || {};
  const load = options.safe !== false ? 'safeLoad' : 'load';

  try {
    const result = yaml[load](source, { schema: MARKDOWN_SCHEMA });
    return JSON.stringify(result, null, '\t');
  } catch (err) {
    this.emitError(err);
    return null;
  }
};
