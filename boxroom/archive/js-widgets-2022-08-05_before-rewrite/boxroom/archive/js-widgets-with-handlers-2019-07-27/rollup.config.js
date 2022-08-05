//import { tslint } from 'rollup-plugin-tslint'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import { uglify as uglify } from 'rollup-plugin-uglify'
import { terser } from 'rollup-plugin-terser'
import gzip from 'rollup-plugin-gzip'

const configs = []

for (const pkg of ['all', 'core', 'dom', 'html', 'handlers', 'hooks', 'svg', 'util']) {
  for (const format of ['umd', 'cjs', 'amd', 'esm']) { // TODO
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
      name: pkg === 'core' || pkg === 'all' ? 'jsWidgets' : `jsWidgets.${pkg}`,
      sourcemap: productive ? false : 'inline',

      globals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'js-spec': 'jsSpec',
        'js-widgets': 'jsWidgets'
      }
    },

    external: pkg === 'all' ? ['js-spec', 'react', 'react-dom'] : ['js-widgets', 'js-spec', 'react', 'react-dom'],

    plugins: [
      resolve({
        jsnext: true,
        main: true,
        browser: true,
      }),
      commonjs(),
      // tslint({
      //}),
      replace({
        exclude: 'node_modules/**',
        delimiters: ['', ''],

        values: {
          'process.env.NODE_ENV': productive ? "'production'" : "'development'",
          "'../core/main/index'": "'js-widgets'",
          "'../../core/main/index'": "'js-widgets'",
          "'../../../core/main/index'": "'js-widgets'",
          "'../../../../core/main/index'": "'js-widgets'",
          "'../../../../../core/main/index'": "'js-widgets'",
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
