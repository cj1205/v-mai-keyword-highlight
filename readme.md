# v-mai-keyword-highlight

A plugin for Vue.js 2 that highlight the keyword (only support one keyword so far). [Check out the demo](https://jsfiddle.net/LoveMai/4xyz6p2t/).

## Installation

- NPM
Run `npm install --save v-mai-keyword-highlight`

- With Modules

``` js
// ES6
import Vue from 'vue'
import vMaiPlugins from 'v-mai-keyword-highlight'
Vue.use(vMaiPlugins.vMaiKeywordHighlight)

// ES5
var Vue = require('vue')
Vue.use(require('v-mai-keyword-highlight')[0])
```

- `<script>` Include

Just include `./dist/v-mai-keyword-highlight.js` after Vue itself.

## Usage

v-mai-keyword-highlight is one custom directive, so the usage is like below

``` html
<div v-mai-keyword-highlight="{keyword:keyword, 'style':'background-color:'+style, 'callback':getKeywordPosition, 'delay':500, key: 1}">
  <p>I am a test 1.</p>
  <p>I am a test 2.</p>
</div>
```

## Custom Configurations

| Name | Type | Value |
| ------ | ------ | ------ |
| keyword | String | The keyword you'd like to search
| style | String | The style applied to the keyword, like 'background-color:red'
| callback | Function | The directive will run this callback with one parameter = [All positions of th keywords already found out] like [{'top':0, 'left': 1}]
| delay | Number | delay how many milliseconds to execute the search
| key | Number or String | You'd better to pass one unique key

## License

[MIT](http://opensource.org/licenses/MIT)
