(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global['v-mai-keyword-highlight'] = factory());
}(this, (function () { 'use strict';

  /**
  * @name VueJS Installer (vue directives)
  * @description highlight the keywords in the component
  * @author John Chen
  * @file install the directives
  */
  function install (_Vue) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (this.__installed) {
      return;
    }
    this.__installed = true;
    if (opts.plugins) {
      Object.keys(opts.plugins).forEach(function (key) {
        var p = opts.plugins[key];
        if (typeof p.install === 'function') {
          p.install(_Vue);
        }
      });
    }
  }

  /**
  * @name VueJS vMaiKeywordHighlight (v-mai-keyword-highlight)
  * @description highlight the keywords in the component
  * @author John Chen
  * @file v-mai-keyword-highlight plugin definition
  */

  function deepClone(vnodes, createElement) {
    var clonedProperties = ['text', 'isComment', 'componentOptions', 'elm', 'context', 'ns', 'isStatic', 'key'];
    function cloneVNode(vnode) {
      var clonedChildren = vnode.children && vnode.children.map(cloneVNode);
      var cloned = createElement(vnode.tag, vnode.data, clonedChildren);
      clonedProperties.forEach(function (item) {
        cloned[item] = vnode[item];
      });
      return cloned;
    }
    return vnodes.map(cloneVNode);
  }

  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      var v = c === 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  }

  var _keywordClassName = 'vue-keyword-highlight-directive-' + uuidv4();

  function replaceTextNodes(cNode, keyword, style, multiple) {
    var newHtml = cNode.textContent.replace(new RegExp('(' + keyword.replace(/[-\\^$*+?.()|[\]{}/]/g, '\\$&') + ')', 'ig'), '<span data-ref="' + _keywordClassName + '" style="' + style + '">$1</span>');
    var rNode = document.createElement('span');
    rNode.innerHTML = newHtml;
    rNode.childNodes.forEach(function (item) {
      cNode.parentNode.insertBefore(item.cloneNode(true), cNode);
    });
    cNode.parentNode.removeChild(cNode);
    return newHtml !== cNode.textContent;
  }

  function addKeywordEffects(el, keyword, style, multiple) {
    if (!keyword) return;
    var founds = [];
    var walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
    var next = walk.nextNode();
    while (next) {
      if (next.textContent.trim().length > 0 && !next.parentElement.classList.contains(_keywordClassName)) {
        founds.push(next);
      }
      next = walk.nextNode();
    }
    var result = [];
    founds.forEach(function (item) {
      var pNode = item.parentElement;
      if (replaceTextNodes(item, keyword, style)) {
        result.push({ 'top': pNode.offsetTop, 'left': pNode.offsetLeft });
      }
    });
    return result;
  }

  function removeKeywordEffects(root) {
    var items = root.querySelectorAll('span[data-ref=' + _keywordClassName + ']');
    items.forEach(function (item) {
      var pNode = item.parentNode;
      pNode.replaceChild(item.firstChild, item);
      pNode.normalize();
    });
  }

  var vMaiKeywordHighlight = {};
  vMaiKeywordHighlight.install = function install(Vue) {
    var timeoutIDs = {};
    var defaultProps = { 'keyword': '', 'style': '', 'callback': function callback() {}, 'delay': 500, 'key': '' };
    Vue.directive('mai-keyword-highlight', {
      bind: function bind(el, binding, vnode) {
        var options = Object.assign({}, defaultProps, binding.value);
        clearTimeout(timeoutIDs[options.key]);

        if (!options.keyword) return;
        timeoutIDs[options.key] = setTimeout(function () {
          var result = addKeywordEffects(el, options.keyword, options.style);
          options.callback(result);
        }, options.delay);
      },
      componentUpdated: function componentUpdated(el, binding, vnode) {
        var options = Object.assign({}, defaultProps, binding.value);
        clearTimeout(timeoutIDs[options.key]);
        var fakeELement = document.createElement('div');
        var clonedNode = deepClone([vnode], vnode.context.$createElement)[0];
        var newEl = vnode.context.__patch__(fakeELement, clonedNode, false);
        while (el.firstChild) {
          el.removeChild(el.firstChild);
        }
        newEl.childNodes.forEach(function (item) {
          el.appendChild(item);
        });
        /*
        // comment out below codes because el will be updated to latest due to above codes
        if (!options.keyword) {
          removeKeywordEffects(el)
          return
        }
        */
        timeoutIDs[options.key] = setTimeout(function () {
          removeKeywordEffects(el);
          var result = addKeywordEffects(el, options.keyword, options.style);
          options.callback(result);
        }, options.delay);
      }
    });
  };



  var plugins = /*#__PURE__*/Object.freeze({
    vMaiKeywordHighlight: vMaiKeywordHighlight
  });

  if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use({ install: install }, {
      plugins: plugins
    });
  }

  return plugins;

})));
