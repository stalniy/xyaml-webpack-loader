// The legacy ESLint resolver does not support package self-references via exports.
/* eslint import/no-unresolved: ["error", { "ignore": ["^xyaml-webpack-loader(?:/|$)"] }] */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import loader from 'xyaml-webpack-loader';
import rollup from 'xyaml-webpack-loader/rollup';
import { parse, createYamlSchema, getOrCreateMdParser } from 'xyaml-webpack-loader/parser';
import * as parserAlias from 'xyaml-webpack-loader/parser.js';
import rollupAlias from 'xyaml-webpack-loader/rollup.js';

const source = 'title: Example\ncontent: !md "**Hello**"';
const expected = { title: 'Example', content: '<strong>Hello</strong>' };

test('public ESM entry points preserve parser behavior', () => {
  assert.equal(parserAlias.parse, parse);
  assert.equal(rollupAlias, rollup);
  assert.deepEqual(parse(source), expected);
  assert.deepEqual(parse('content: !md "# Heading"'), {
    content: '<h1 id="Heading"><a name="Heading" class="markdown-it-headinganchor" href="#"></a>Heading</h1>'
  });
  assert.deepEqual(parse('content: !md "text @{.example}"'), {
    content: '<p class="example">text</p>'
  });
});

test('parser and schema instances are reused for the same options', () => {
  assert.equal(getOrCreateMdParser(), getOrCreateMdParser());
  const options = {};
  assert.equal(createYamlSchema(options), createYamlSchema(options));
  const mdOptions = { use: { 'markdown-it-headinganchor': false } };
  assert.equal(getOrCreateMdParser(mdOptions), getOrCreateMdParser(mdOptions));
  assert.equal(getOrCreateMdParser(mdOptions).render('# Heading').trim(), '<h1>Heading</h1>');
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
