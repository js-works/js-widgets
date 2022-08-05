'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/js-scenery.core.cjs.production.js')
} else {
  module.exports = require('./dist/js-scenery.core.cjs.development.js')
}
