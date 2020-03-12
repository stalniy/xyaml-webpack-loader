const { createFilter, dataToEsm } = require('@rollup/pluginutils'); // eslint-disable-line
const { parse } = require('./yaml');

const isYaml = id => id.endsWith('.yaml') || id.endsWith('.yml');

module.exports = function yaml(options = {}) {
  const filter = createFilter(options.include, options.exclude);
  const esm = !options.esm || options.esm === true ? null : options.esm;
  const esmOptions = {
    indent: '\t',
    ...esm
  };

  return {
    name: 'yaml',
    transform(source, id) {
      if (!isYaml(id) || !filter(id)) {
        return null;
      }

      const content = parse(source, options);
      const code = options.esm ? dataToEsm(content, esmOptions) : JSON.stringify(content);

      return {
        code,
        map: { mappings: '' }
      };
    }
  };
};
