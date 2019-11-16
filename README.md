# Extended YAML Webpack loader

xyaml-webpack-loader loads YAML files with custom schema. Out of the box it supports:
- [markdown](https://en.wikipedia.org/wiki/Markdown)

## Install

```sh
npm i -D xyaml-webpack-loader
# or
yarn add -D xyaml-webpack-loader
```

## Configure Webpack

```js
// webpack.config.js
module: {
  rules: [{
    type: 'json',
    test: /\.yaml$/,
    use: 'xyaml-webpack-loader',
  }]
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