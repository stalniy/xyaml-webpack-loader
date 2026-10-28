// The legacy ESLint resolver does not support package self-references via exports.
/* eslint import/no-unresolved: ["error", { "ignore": ["^xyaml-webpack-loader(?:/|$)"] }] */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { yaml2json as loader } from 'xyaml-webpack-loader';
import { yaml as rollup } from 'xyaml-webpack-loader/rollup';
import { parse, createYamlSchema, getOrCreateMdParser } from 'xyaml-webpack-loader/parser';
import * as parserAlias from 'xyaml-webpack-loader/parser.js';
import { yaml as rollupAlias } from 'xyaml-webpack-loader/rollup.js';

const source = 'title: Example\ncontent: !md "**Hello**"';
const expected = { title: 'Example', content: '<strong>Hello</strong>' };

test('public ESM entry points preserve parser behavior', () => {
  assert.equal(parserAlias.parse, parse);
  assert.equal(rollupAlias, rollup);
  assert.deepEqual(parse(source), expected);
  assert.deepEqual(parse('content: !md "# Heading"'), {
    content: '<h1>Heading</h1>'
  });
  assert.deepEqual(parse('content: !md "text @{.example}"'), {
    content: 'text @{.example}'
  });
});

test('parser and schema instances are reused for the same options', () => {
  assert.equal(getOrCreateMdParser(), getOrCreateMdParser());
  const options = {};
  assert.equal(createYamlSchema(options), createYamlSchema(options));
  const mdOptions = { use: [] };
  assert.equal(getOrCreateMdParser(mdOptions), getOrCreateMdParser(mdOptions));
  assert.equal(getOrCreateMdParser(mdOptions).render('# Heading').trim(), '<h1>Heading</h1>');
});

test('Markdown scalar tags handle empty values and custom parsers', () => {
  const options = {
    markdown: { parser: { render: value => (value ? `<p>Custom ${value}</p>` : '') } }
  };
  assert.deepEqual(parse('empty: !md\nquoted: !md ""', options), { empty: '', quoted: '' });
  assert.deepEqual(parse('content: !md "Hello"', options), { content: 'Custom Hello' });
  assert.throws(() => parse('content: !md [Hello]', options));
});

test('parser supports disabling Markdown and the legacy safe option', () => {
  assert.deepEqual(parse('enabled: true\ncount: 42', { markdown: false }), {
    enabled: true, count: 42
  });
  assert.throws(() => parse(source, { markdown: false }), /unknown scalar tag/);
  assert.deepEqual(parse('title: Example', { safe: true, markdown: false }), { title: 'Example' });
  assert.deepEqual(parse('title: Example', { safe: false, markdown: false }), { title: 'Example' });
});

test('Webpack loader returns JSON and reports parse errors', () => {
  let cacheable = false;
  const context = {
    query: {},
    cacheable() { cacheable = true; },
    emitError(err) { throw err; }
  };
  assert.deepEqual(JSON.parse(loader.call(context, source)), expected);
  assert.equal(cacheable, true);

  let error;
  const invalidContext = { query: {}, emitError(err) { error = err; } };
  assert.equal(loader.call(invalidContext, 'x: ['), null);
  assert.ok(error instanceof Error);
});

test('Rollup plugin filters files and produces JSON or ESM', async () => {
  const plugin = rollup();
  assert.deepEqual(JSON.parse(plugin.transform(source, 'example.yaml').code), expected);
  assert.equal(plugin.transform(source, 'example.txt'), null);
  assert.equal(rollup({ exclude: '**/ignored.yaml' }).transform(source, 'ignored.yaml'), null);

  const transformed = rollup({ esm: true }).transform(source, 'example.yml');
  const compiled = await import(`data:text/javascript,${encodeURIComponent(transformed.code)}`);
  assert.deepEqual(compiled.default, expected);
  assert.equal(compiled.title, 'Example');
});
