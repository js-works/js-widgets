'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('../dist/js-widgets.dom.cjs.production.js')
} else {
  module.exports = require('../dist/js-widgets.dom.cjs.development.js')
}
