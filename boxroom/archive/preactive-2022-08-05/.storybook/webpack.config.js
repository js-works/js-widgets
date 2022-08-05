const path = require('path');

module.exports = ({ config }) => {
  const alias = (config.resolve && config.resolve.alias) || {};
  alias['preactive$'] = path.resolve(__dirname, '../src/main/core.ts');
  alias['preactive/hooks$'] = path.resolve(__dirname, '../src/main/hooks.ts');
  alias['preactive/ext$'] = path.resolve(__dirname, '../src/main/ext.ts');
  alias['preactive/util$'] = path.resolve(__dirname, '../src/main/util.ts');
  alias['preactive/mobx-tools$'] = path.resolve(
    __dirname,
    '../src/main/mobx-tools.ts'
  );

  config.resolve.alias = alias;
  config.resolve.extensions.push('.ts', '.tsx');

  return config;
};
