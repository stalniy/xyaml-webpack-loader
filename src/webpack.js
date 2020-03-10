const { getOptions } = require('loader-utils'); // eslint-disable-line
const { parse } = require('./yaml');

module.exports = function yaml2json(source) {
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
};
