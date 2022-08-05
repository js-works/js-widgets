//import { tslint } from 'rollup-plugin-tslint'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import { uglify as uglify } from 'rollup-plugin-uglify'
import { terser } from 'rollup-plugin-terser'
import gzip from 'rollup-plugin-gzip'

const configs = []

for (const pkg of ['all', 'common', 'core', 'handlers', 'html', 'hooks', 'svg', 'tools', 'util', 'patterns']) {
  for (const format of ['umd', 'cjs', 'amd', 'esm']) {
    for (const productive of [false, true]) {
      configs.push(createConfig(pkg, format, productive))
    }
  }
}

export default configs

// --- locals -------------------------------------------------------

function createConfig(pkg, moduleFormat, productive) {
  return {
    input: `src/modules/${pkg}/main/index.ts`, 

    output: {
      file: productive
        ? `dist/js-widgets.${pkg}.${moduleFormat}.production.js`
        : `dist/js-widgets.${pkg}.${moduleFormat}.development.js`,

      format: moduleFormat,
      sourcemap: false, // productive ? false : 'inline', // TODO

      name: pkg === 'core' || pkg === 'all'
        ? 'jsWidgets'
        : `jsWidgets${pkg[0].toUpperCase() + pkg.substr(1)}`,

      globals: {
        'dyo': 'dyo',
        'js-spec': 'jsSpec',
        'js-widgets': 'jsWidgets'
      }
    },

    external: pkg === 'all' ? ['js-widgets'] : ['js-spec', 'js-widgets'],

    plugins: [
      resolve(),
      commonjs(),
      // tslint({
      //}),
      replace({
        exclude: 'node_modules/**',
        delimiters: ['', ''],

        values: pkg === 'all' ? {
          'process.env.NODE_ENV': productive ? "'production'" : "'development'",
        } : {
          'process.env.NODE_ENV': productive ? "'production'" : "'development'",
          "'../core/main/index'": "'js-widgets'",
          "'../../core/main/index'": "'js-widgets'",
          "'../../../core/main/index'": "'js-widgets'",
          "'../../../../core/main/index'": "'js-widgets'",
          "'../../../../../core/main/index'": "'js-widgets'",

          /*
          "'../util/main/index'": "'js-widgets/util'",
          "'../../util/main/index'": "'js-widgets/util'",
          "'../../../util/main/index'": "'js-widgets/util'",
          "'../../../../util/main/index'": "'js-widgets/util'",
          "'../../../../../util/main/index'": "'js-widgets/util'",
          */
        }
      }),
      typescript({
        exclude: 'node_modules/**',
      }),
      productive && (moduleFormat === 'esm' ? terser() : uglify()),
      productive && gzip()
    ],
  }
}
