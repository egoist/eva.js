'use strict'
const gulp = require('gulp')
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const uglify = require('rollup-plugin-uglify')
const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const replace = require('rollup-plugin-replace')

gulp.task('cjs', () => {
  return rollup.rollup({
    entry: './src/index.js',
    plugins: [
      babel({
        babelrc: false,
        presets: ['es2015-rollup', 'stage-1'],
        exclude: 'node_modules/**'
      })
    ]
  }).then(bundle => {
    return bundle.write({
      dest: './dist/eva.common.js',
      format: 'cjs'
    })
  })
})

gulp.task('umd', () => {
  return rollup.rollup({
    entry: './src/index.js',
    plugins: [
      babel({
        babelrc: false,
        presets: ['es2015-rollup', 'stage-1'],
        exclude: 'node_modules/**'
      }),
      nodeResolve(),
      commonjs(),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
        'process.env.VUE_ENV': JSON.stringify('client')
      })
    ]
  }).then(bundle => {
    return bundle.write({
      dest: './dist/eva.js',
      format: 'umd',
      moduleName: 'EVA'
    })
  })
})

gulp.task('umd:min', () => {
  return rollup.rollup({
    entry: './src/index.js',
    plugins: [
      babel({
        babelrc: false,
        presets: ['es2015-rollup', 'stage-1'],
        exclude: 'node_modules/**'
      }),
      nodeResolve(),
      commonjs(),
      uglify(),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        'process.env.VUE_ENV': JSON.stringify('client')
      })
    ]
  }).then(bundle => {
    return bundle.write({
      dest: './dist/eva.min.js',
      format: 'umd',
      sourceMap: true,
      moduleName: 'EVA'
    })
  })
})

gulp.task('watch', () => {
  gulp.watch('./src/*.js', ['umd'])
})

gulp.task('build', ['cjs', 'umd', 'umd:min'])

gulp.task('default', ['watch', 'build'])
