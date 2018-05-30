/**
* @name VueJS Installer (vue directives)
* @description highlight the keywords in the component
* @author John Chen
* @file install the directives
*/
export default function (_Vue, opts = {}) {
  if (this.__installed) {
    return
  }
  this.__installed = true
  if (opts.plugins) {
    Object.keys(opts.plugins).forEach(key => {
      const p = opts.plugins[key]
      if (typeof p.install === 'function') {
        p.install( _Vue )
      }
    })
  }
}
