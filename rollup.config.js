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
      //  ? `dist/js-widgets.${moduleFormat}.production.js`
      //  : `dist/js-widgets.${moduleFormat}.development.js`,

      file: `dist/js-widgets.${pkg}.${moduleFormat}.js`,

      format: moduleFormat,
      sourcemap: false, //productive ? false : 'inline',
      name: 'jsWidgets'
    },

    external: [
      'js-widgets',
      'js-widgets/ext',
      'js-widgets/hooks',
      'js-widgets/util'
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
