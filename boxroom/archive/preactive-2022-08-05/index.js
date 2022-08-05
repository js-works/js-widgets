'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/preactive.cjs.production.js');
} else {
  module.exports = require('./dist/preactive.cjs.development.js');
}
