'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('../dist/js-widgets.core.cjs.production.js')
} else {
  module.exports = require('../dist/js-widgets.core.cjs.development.js')
}
