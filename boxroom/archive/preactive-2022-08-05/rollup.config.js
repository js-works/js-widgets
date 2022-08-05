import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import gzip from 'rollup-plugin-gzip';

const configs = [];

for (const pkg of ['core', 'ext', 'hooks', 'util', 'mobx-tools']) {
  for (const format of ['cjs', 'esm', 'umd' /*, 'amd' */]) {
    for (const productive of [/*false, */ true]) {
      configs.push(createConfig(pkg, format, productive));
    }
  }
}

export default configs;

// --- locals -------------------------------------------------------

function createConfig(pkg, moduleFormat, productive) {
  return {
    input: `src/main/${pkg}.ts`,

    output: {
      // file: productive
      //  ? `dist/preactive.${moduleFormat}.production.js`
      //  : `dist/preactive.${moduleFormat}.development.js`,

      file: `dist/preactive.${pkg}.${moduleFormat}.js`,

      format: moduleFormat,
      sourcemap: false, //productive ? false : 'inline',
      name: 'preactive',

      globals: {
        preact: 'preact'
      }
    },

    external: [
      'preact',
      'preactive',
      'preactive/ext',
      'preactive/hooks',
      'preactive/util'
    ],

    plugins: [
      resolve(),
      commonjs(),
      replace({
        exclude: 'node_modules/**',
        delimiters: ['', ''],
        preventAssignment: true,
        values: {
          'process.env.NODE_ENV': productive ? "'production'" : "'development'"
        }
      }),
      typescript({
        exclude: 'node_modules/**'
      }),
      productive && terser(),
      productive && gzip()
    ]
  };
}
