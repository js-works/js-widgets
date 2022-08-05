'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('../dist/js-widgets.tools.cjs.production.js')
} else {
  module.exports = require('../dist/js-widgets.tools.cjs.development.js')
}
