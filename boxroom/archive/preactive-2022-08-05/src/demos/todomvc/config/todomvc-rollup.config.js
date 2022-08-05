import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import serve from 'rollup-plugin-serve';
import alias from 'rollup-plugin-alias';

export default {
  input: './src/demos/todomvc/todomvc.tsx',
  output: {
    file: 'build/todomvc/todomvc.js',
    sourcemap: true
  },
  plugins: [
    //commonjs(),
    resolve({
      modulesOnly: true
    }),
    alias({
      preactive: '../../main/core.tsx',
      'preactive/ext': '../../main/ext.tsx',
      'preactive/mobx-tools': '../../main/mobx-tools.tsx'
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
      openPage: '/todomvc.html',
      contentBase: ['src/demos/todomvc', 'build/todomvc'],
      port: 3000
    })
  ]
};
