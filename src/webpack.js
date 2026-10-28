import loaderUtils from 'loader-utils';
import { parse } from './yaml.js';

const { getOptions } = loaderUtils;

export function yaml2json(source) {
  if (this.cacheable) {
    this.cacheable();
  }

  const options = getOptions(this) || {};

  try {
    const result = parse(source, options);
    return JSON.stringify(result, null, '\t');
  } catch (err) {
    this.emitError(err);
    return null;
  }
}
