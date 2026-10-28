import assert from 'node:assert/strict';
import { test } from 'node:test';
import attrs from 'markdown-it-attrs';
import createMdParser from '../src/services/markdown.js';

test('Markdown has no plugins by default', () => {
  const parser = createMdParser();

  assert.equal(parser.render('# Heading'), '<h1>Heading</h1>\n');
  assert.equal(parser.render('text @{.example}'), '<p>text @{.example}</p>\n');
});

test('plugin tuples enable explicitly configured plugins', () => {
  const parser = createMdParser({
    use: [
      [attrs, { leftDelimiter: '{' }]
    ]
  });

  assert.equal(parser.render('# Heading {.example}'), '<h1 class="example">Heading</h1>\n');
});

test('plugin tuples accept omitted, true, object, and multiple options', () => {
  const calls = [];
  const plugins = Array.from({ length: 4 }, () => (parser, ...args) => {
    calls.push(args);
    parser.renderer.rules.text = tokens => tokens[0].content.toUpperCase();
  });
  const parser = createMdParser({
    use: [
      [plugins[0]],
      [plugins[1], true],
      [plugins[2], { enabled: true }],
      [plugins[3], ['image', { enabled: true }]]
    ]
  });

  assert.deepEqual(calls, [
    [undefined], [], [{ enabled: true }], ['image', { enabled: true }]
  ]);
  assert.equal(parser.render('hello'), '<p>HELLO</p>\n');
});

test('configuration callbacks can apply plugin tuples', () => {
  const parser = createMdParser({
    use(md, applyPlugins) {
      applyPlugins(md);
      applyPlugins(md, [[attrs, { leftDelimiter: '@{' }]]);
    }
  });

  assert.equal(parser.render('# Heading'), '<h1>Heading</h1>\n');
  assert.equal(parser.render('text @{.example}'), '<p class="example">text</p>\n');
});
