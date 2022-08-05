//import tslint from 'rollup-plugin-tslint'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import { uglify as uglify } from 'rollup-plugin-uglify'
import { terser } from 'rollup-plugin-terser'
import gzip from 'rollup-plugin-gzip'

const configs = []

for (const pkg of ['core', 'adapt-react', 'adapt-dyo', /* 'adapt-preact' */]) {
  for (const productive of [false, true]) {
    configs.push(createConfig(pkg, 'esm', productive))
  }
}

export default configs

// --- locals -------------------------------------------------------

function createConfig(pkg, moduleFormat, productive) {
  return {
    input: `src/modules/${pkg}/main/index.ts`, 

    output: {
      file: productive
        ? `dist/js-scenery.${pkg}.${moduleFormat}.production.js`
        : `dist/js-scenery.${pkg}.${moduleFormat}.development.js`,

      format: moduleFormat,
      
      name: {
        core: 'jsScenery',
      }[pkg] || `jsScenery.${pkg}`,
     
      sourcemap: productive ? false : 'inline',

      globals: {
        'js-scenery': 'jsScenery',
        'react': 'React',
        'react-dom': 'ReactDOM',
      }
    },

    external: ['js-scenery', 'react', 'react-dom'].concat(productive ? 'js-spec' : []), 

    plugins: [
      resolve({
        jsnext: true,
        main: true,
        browser: true,
      }),
      commonjs(),
      // TODO: Configure "tslint.json" properly and fix all errors
      //tslint({
      //  throwOnError: true
      //}),
      replace({
        exclude: 'node_modules/**',
        delimiters: ['', ''],

        values: {
          'process.env.NODE_ENV': productive ? "'production'" : "'development'",
          "'../core/main/index'": "'js-scenery'",
          "'../../core/main/index'": "'js-scenery'",
          "'../../../core/main/index'": "'js-scenery'",
          "'../../../../core/main/index'": "'js-scenery'",
          "'../../../../../core/main/index'": "'js-scenery'",
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
