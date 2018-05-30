/**
* @name VueJS vMaiKeywordHighlight (v-mai-keyword-highlight)
* @description highlight the keywords in the component
* @author John Chen
* @file v-mai-keyword-highlight plugin definition
*/

function deepClone (vnodes, createElement) {
  let clonedProperties = ['text', 'isComment', 'componentOptions', 'elm', 'context', 'ns', 'isStatic', 'key']
  function cloneVNode (vnode) {
    let clonedChildren = vnode.children && vnode.children.map(cloneVNode)
    let cloned = createElement(vnode.tag, vnode.data, clonedChildren)
    clonedProperties.forEach(function (item) {
      cloned[item] = vnode[item]
    })
    return cloned
  }
  return vnodes.map(cloneVNode)
}

function uuidv4 () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0
    let v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

const _keywordClassName = 'vue-keyword-highlight-directive-' + uuidv4()

function replaceTextNodes (cNode, keyword, style, multiple) {
  let newHtml = cNode.textContent.replace(new RegExp('(' + keyword.replace(/[-\\^$*+?.()|[\]{}/]/g, '\\$&') + ')', 'ig'),
    '<span data-ref="' + _keywordClassName + '" style="' + style + '">$1</span>'
  )
  let rNode = document.createElement('span')
  rNode.innerHTML = newHtml
  rNode.childNodes.forEach((item) => {
    cNode.parentNode.insertBefore(item.cloneNode(true), cNode)
  })
  cNode.parentNode.removeChild(cNode)
  return newHtml !== cNode.textContent
}

function addKeywordEffects (el, keyword, style, multiple) {
  if (!keyword) return
  let founds = []
  let walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false)
  let next = walk.nextNode()
  while (next) {
    if (next.textContent.trim().length > 0 && !next.parentElement.classList.contains(_keywordClassName)) {
      founds.push(next)
    }
    next = walk.nextNode()
  }
  let result = []
  founds.forEach((item) => {
    let pNode = item.parentElement
    if (replaceTextNodes(item, keyword, style)) {
      result.push({'top': pNode.offsetTop, 'left': pNode.offsetLeft})
    }
  })
  return result
}

function removeKeywordEffects (root) {
  let items = root.querySelectorAll('span[data-ref=' + _keywordClassName + ']')
  items.forEach((item) => {
    let pNode = item.parentNode
    pNode.replaceChild(item.firstChild, item)
    pNode.normalize()
  })
}

let vMaiKeywordHighlight = {}
vMaiKeywordHighlight.install = function install (Vue) {
  let timeoutIDs = {}
  let defaultProps = {'keyword':'', 'style':'', 'callback': function () {}, 'delay': 500, 'key': ''}
  Vue.directive('mai-keyword-highlight', {
    bind: function bind (el, binding, vnode) {
      let options = Object.assign({}, defaultProps, binding.value)
      clearTimeout(timeoutIDs[options.key])

      if (!options.keyword) return
      timeoutIDs[options.key] = setTimeout(() => {
        let result = addKeywordEffects(el, options.keyword, options.style)
        options.callback(result)
      }, options.delay)
    },
    componentUpdated: function componentUpdated (el, binding, vnode) {
      let options = Object.assign({}, defaultProps, binding.value)
      clearTimeout(timeoutIDs[options.key])
      let fakeELement = document.createElement('div')
      let clonedNode = deepClone([vnode], vnode.context.$createElement)[0]
      let newEl = vnode.context.__patch__(fakeELement, clonedNode, false)
      while (el.firstChild) {
        el.removeChild(el.firstChild)
      }
      newEl.childNodes.forEach((item) => {
        el.appendChild(item)
      })
      /*
      // comment out below codes because el will be updated to latest due to above codes
      if (!options.keyword) {
        removeKeywordEffects(el)
        return
      }
      */
      timeoutIDs[options.key] = setTimeout(() => {
        removeKeywordEffects(el)
        let result = addKeywordEffects(el, options.keyword, options.style)
        options.callback(result)
      }, options.delay)
    }
  })
}

export default vMaiKeywordHighlight
