import install from './install'
import * as plugins from './directives'

export default plugins

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use({ install }, {
    plugins
  })
}
