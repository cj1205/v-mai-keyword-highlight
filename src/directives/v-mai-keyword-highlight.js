/**
* @name VueJS vMaiKeywordHighlight (v-mai-keyword-highlight)
* @description highlight the keywords in the component
* @author John Chen
* @file v-mai-keyword-highlight plugin definition
*/

function uuidv4 () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0
    let v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

const _keywordClassName = 'vue-keyword-highlight-directive-' + uuidv4()

function replaceTextNodes (cNode, regexPattern, style) {
  let newHtml = cNode.textContent.replace(
    regexPattern,
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

function getTextNodes(root, keywords) {
  if (!keywords || keywords.length == 0) return []
  let minLength = Math.min(...keywords.map((keyword) => {
    return keyword ? keyword.length : 0
  }))
  let founds = []
  let walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false)
  let next = walk.nextNode()
  while (next) {
    if (next.textContent.length >= minLength
      && !next.parentElement.classList.contains(_keywordClassName)) {
      founds.push(next)
    }
    next = walk.nextNode()
  }
  return founds
}

function addKeywordEffects (root, keywordString, style, matchCase, multiple) {
  let result = []
  let keywords = multiple ? keywordString.split(' ').filter((keyword) => {
    return keyword.length > 0
  }): [keywordString]
  let founds = getTextNodes(root, keywords)
  let keywordRegex =  new RegExp(
    '('
    + keywords.map((keyword) => {
      return keyword.replace(/[-\\^$*+?.()|[\]{}/]/g, '\\$&')
    }).join('|') + ')',
    (matchCase ? '' : 'i') + 'g'
  )
  founds.forEach((item) => {
    let pNode = item.parentElement
    if (replaceTextNodes(item, keywordRegex, style)) {
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
  let defaultProps = {'keyword':'', 'style':'background-color:yellow', 'callback': function () {}, 'delay': 500, 'key': ''}
  Vue.directive('mai-keyword-highlight', {
    bind: function bind (el, binding, vnode) {
      let options = Object.assign({}, defaultProps, binding.value)
      clearTimeout(timeoutIDs[options.key])

      if (!options.keyword) return
      timeoutIDs[options.key] = setTimeout(() => {
        let result = addKeywordEffects(el, options.keyword.toString(), options.style, options['match-case'], options.multiple)
        options.callback(result)
      }, options.delay)
    },
    componentUpdated: function componentUpdated (el, binding, vnode) {
      let options = Object.assign({}, defaultProps, binding.value)
      clearTimeout(timeoutIDs[options.key])
      if (!options.keyword) {
        removeKeywordEffects(el)
        return
      }
      timeoutIDs[options.key] = setTimeout(() => {
        removeKeywordEffects(el)
        let result = addKeywordEffects(el, options.keyword.toString(), options.style, options['match-case'], options.multiple)
        options.callback(result)
      }, options.delay)
    }
  })
}

export default vMaiKeywordHighlight
