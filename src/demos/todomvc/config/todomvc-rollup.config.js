import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import alias from 'rollup-plugin-alias';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

export default {
  input: './src/demos/todomvc/todomvc.tsx',
  output: {
    file: 'build/todomvc/todomvc.js',
    sourcemap: true
  },
  plugins: [
    commonjs(),
    resolve({}),
    alias({
      'js-widgets': '../../main/core.tsx',
      'js-widgets/ext': '../../main/ext.tsx',
      'js-widgets/util': '../../main/util.tsx',
      'js-widgets/mobx-tools': '../../main/mobx-tools.tsx'
    }),
    replace({
      exclude: 'node_modules/**',
      preventAssignment: true,

      values: {
        'process.env.NODE_ENV': "'development'"
      }
    }),
    typescript({
      sourceMap: true,
      exclude: 'node_modules/**'
    }),
    serve({
      open: true,
      openPage: '/index.html',
      contentBase: ['src/demos/todomvc', 'build/todomvc'],
      port: 3000
    }),
    livereload('build')
  ]
};
