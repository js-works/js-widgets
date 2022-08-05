const path = require('path');

module.exports = ({ config }) => {
  const alias = (config.resolve && config.resolve.alias) || {};
  alias['js-widgets$'] = path.resolve(__dirname, '../src/main/core.ts');
  alias['js-widgets/hooks$'] = path.resolve(__dirname, '../src/main/hooks.ts');
  alias['js-widgets/ext$'] = path.resolve(__dirname, '../src/main/ext.ts');
  alias['js-widgets/util$'] = path.resolve(__dirname, '../src/main/util.ts');
  alias['js-widgets/mobx-tools$'] = path.resolve(
    __dirname,
    '../src/main/mobx-tools.ts'
  );

  config.resolve.alias = alias;
  config.resolve.extensions.push('.ts', '.tsx');

  return config;
};
