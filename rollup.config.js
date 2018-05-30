import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  entry: './src/index.js',
  dest: './dist/v-mai-keyword-highlight.js',

  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      presets: [ [ "es2015", { "modules": false } ] ]
    })
  ],

  format: 'umd',
  moduleName: 'v-mai-keyword-highlight'
}
