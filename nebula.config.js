const path = require('path');

const { version } = require(path.resolve(__dirname, './package.json')); // eslint-disable-line
const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const sourcemap = mode !== 'production';

module.exports = {
  build: {
    sourcemap,
    mode,
    typescript: true,
    replacementStrings: {
      'process.env.PACKAGE_VERSION': JSON.stringify(version),
    },
  },
};
