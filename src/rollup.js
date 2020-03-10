const { createFilter, dataToEsm } = require('@rollup/pluginutils'); // eslint-disable-line
const { parse } = require('./yaml');

const isYaml = id => id.endsWith('.yaml') || id.endsWith('.yml');

function yaml({ include,
  exclude,
  indent,
  preferConst,
  compact,
  namedExports,
  asModule,
  ...options }) {
  const filter = createFilter(include, exclude);
  const esmOptions = {
    preferConst,
    compact,
    namedExports,
    indent: indent || '\t'
  };

  return {
    name: 'yaml',
    transform(source, id) {
      if (!isYaml(id) || !filter(id)) {
        return null;
      }

      const content = parse(source, options);
      const code = asModule ? dataToEsm(content, esmOptions) : JSON.stringify(content);

      return {
        code,
        map: { mappings: '' }
      };
    }
  };
}

module.exports = yaml;
