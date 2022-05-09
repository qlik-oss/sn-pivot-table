const path = require('path');

const { version } = require(path.resolve(__dirname, './package.json')); // eslint-disable-line

module.exports = {
  build: {
    typescript: true,
    replacementStrings: {
      'process.env.PACKAGE_VERSION': JSON.stringify(version),
    },
  },
};
