import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

export default {
  input: 'src/demo/demo.ts',

  output: {
    file: './build/demo.js',
    format: 'umd',

    globals: {
      'dyo': 'dyo',
      'js-spec': 'jsSpec'
    }
  },

  external: ['js-spec', 'dyo'],
  
  plugins: [
    resolve(),
    commonjs(),
    replace({
      exclude: 'node_modules/**',
      
      values: {
        'process.env.NODE_ENV': "'development'"
      }
    }),
    typescript({
      tsconfigOverride: {
        include: ['./src/modules/*/main/**/*.ts*', './src/demo/**/*.ts*']
      }
    }),
    serve({
      open: true,
      contentBase: '.',
      openPage: '/src/demo/index.html'
    }),
    livereload({
      watch: ['src/demo', 'build']
    })
  ]
}
