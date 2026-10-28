import { createFilter, dataToEsm } from '@rollup/pluginutils';
import { parse } from './yaml.js';

const isYaml = id => id.endsWith('.yaml') || id.endsWith('.yml');

export function yaml(options = {}) {
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
}
