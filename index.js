'use strict';

// TODO!!!
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/js-widgets.core.cjs.js');
} else {
  module.exports = require('./dist/js-widgets.core.cjs.js');
}
