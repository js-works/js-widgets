'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('../dist/js-widgets.common.cjs.production.js')
} else {
  module.exports = require('../dist/js-widgets.common.cjs.development.js')
}
