# Extended YAML loader

xyaml-webpack-loader loads YAML files with custom schema. Out of the box it supports:
- [markdown](https://en.wikipedia.org/wiki/Markdown)

It also supports [rollupjs](https://rollupjs.org/guide/en/).

## Install

```sh
npm i -D xyaml-webpack-loader
# or
yarn add -D xyaml-webpack-loader
```

## Configure Webpack

```js
// webpack.config.js
module.exports = {
  // ...
  module: {
    rules: [{
      type: 'json',
      test: /\.yaml$/,
      use: 'xyaml-webpack-loader',
      options: { // default configuration
        markdown: {
          use: {
            'markdown-it-headinganchor': {} // you can specify `false` to disable plugin
            'markdown-it-attrs': { leftDelimiter: '@{' }
          }
        }
      }
    }]
  }
}
```

You can configure `markdown-it` parser to use any modules, by specifying them in `use` option.

## Configure rollup

```js
// rollup.config.js
import yaml from 'xyaml-webpack-loader/rollup';

export {
  // ...
  plugins: [
    yaml({
      markdown: { // default configuration, no need to provide
        use: {
          'markdown-it-headinganchor': {} // you can specify `false` to disable plugin
          'markdown-it-attrs': { leftDelimiter: '@{' }
        }
      }
    })
  ]
}
```

## Example YAML

```yaml
# about-us.page.yml
title: About us
meta:
  title: About
  keywords: About
  description: About description
content: !md | # Pay attention to the !md prefix
  My first paragraph

  * some bullet points
  * another bullet point

  [link to some site](https://some.site.com)

  ### Additional information

  * Other bullet points
  * Final words
```

## Example Usage

```js
import aboutUs from './about-us.page.yml';

console.log(aboutUs.content) // rendered HTML string
```

## Use parser

You can also use parser programatically:

```js
const { parse } = require('xyaml-webpack-loader/parser');
const fs = require('fs');

const content = parse(fs.readFileSync('about-us.page.yml'));
```

## Advanced Markdown configuration

Some `markdown-it` plugins accept more than single options argument (e.g., [markdown-it-container](https://github.com/markdown-it/markdown-it-container)). In such cases, we can specify an array of options:

```js
const options = {
  markdown: { // default configuration, no need to provide
    use: {
      'markdown-it-container': ['image', {
        // other options here
      }]
    }
  }
};
```

Or if we need to call the same plugin multiple times, we can use a function:

```js
const options = {
  markdown: { // default configuration, no need to provide
    use(parser, applyPlugins) {
      applyPlugins(parser); // apply default plugins
      parser.use('markdown-it-container', 'image', {
        // other options here
      });
      parser.use('markdown-it-container', 'spoiler', {
        // other options here
      });
    }
  }
};
```
