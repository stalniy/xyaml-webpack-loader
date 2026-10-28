import yaml from 'js-yaml';
import createMarkdownType from './types/MarkdownType.js';
import createMdParser from './services/markdown.js';
import memoize from './services/memoize.js';

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

export {
  createYamlSchema,
  createMarkdownType,
  getOrCreateMdParser,
  parse
};
