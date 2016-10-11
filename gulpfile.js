'use strict'
const gulp = require('gulp')
const rollup = require('rollup')
const uglify = require('rollup-plugin-uglify')
const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const replace = require('rollup-plugin-replace')
const buble = require('rollup-plugin-buble')

gulp.task('cjs', () => {
  return rollup.rollup({
    entry: './src/index.js',
    plugins: [
      buble(),
      replace({
        'RESOLVE_VUE': 'vue'
      })
    ]
  }).then(bundle => {
    return bundle.write({
      dest: './dist/eva.common.js',
      format: 'cjs',
      exports: 'named'
    })
  })
})

gulp.task('umd', () => {
  return rollup.rollup({
    entry: './src/index.js',
    plugins: [
      buble(),
      nodeResolve(),
      commonjs(),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
        'process.env.VUE_ENV': JSON.stringify('client'),
        'RESOLVE_VUE': 'vue/dist/vue'
      })
    ]
  }).then(bundle => {
    return bundle.write({
      dest: './dist/eva.js',
      format: 'umd',
      moduleName: 'EVA',
      exports: 'named'
    })
  })
})

gulp.task('umd:min', () => {
  return rollup.rollup({
    entry: './src/index.js',
    plugins: [
      buble(),
      nodeResolve(),
      commonjs(),
      uglify(),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        'process.env.VUE_ENV': JSON.stringify('client'),
        'RESOLVE_VUE': 'vue/dist/vue'
      })
    ]
  }).then(bundle => {
    return bundle.write({
      dest: './dist/eva.min.js',
      format: 'umd',
      sourceMap: true,
      moduleName: 'EVA',
      exports: 'named'
    })
  })
})

gulp.task('watch', () => {
  gulp.watch('./src/*.js', ['umd'])
})

gulp.task('build', ['cjs', 'umd', 'umd:min'])

gulp.task('default', ['watch', 'build'])
