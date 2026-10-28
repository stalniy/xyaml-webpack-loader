import * as yaml from 'js-yaml';
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

  return yaml.CORE_SCHEMA.withTags(types);
});

function parse(source, options = {}) {
  return yaml.load(source, { schema: createYamlSchema(options) });
}

export {
  createYamlSchema,
  createMarkdownType,
  getOrCreateMdParser,
  parse
};
