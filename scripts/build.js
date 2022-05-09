#! /usr/bin/env node
/* eslint-disable no-console */

const yargs = require('yargs');
const fs = require('fs-extra');
const path = require('path');
const build = require('@nebula.js/cli-build');
const sense = require('@nebula.js/cli-sense');

const args = yargs(process.argv.slice(2)).argv;
const buildExt = args.ext;
const buildCore = args.core;
const mode = args.mode || 'production';
const watch = args.w;
const sourcemap = mode !== 'production';

// cleanup old build
fs.removeSync(path.resolve(process.cwd(), 'dist'));
fs.removeSync(path.resolve(process.cwd(), 'core/esm'));
if (buildExt) {
  fs.removeSync(path.resolve(process.cwd(), 'sn-pivot-table-ext'));
}

const buildArgs = {};

const buildExtension = async () => {
  console.log('---> BUILDING EXTENSION');
  await sense({ output: 'sn-pivot-table-ext', sourcemap });
};

if (buildCore) {
  buildArgs.core = 'core';
}

if (mode === 'production') {
  buildArgs.sourcemap = false;
} else {
  buildArgs.mode = mode;
}

if (watch) {
  buildArgs.watch = true;
}

const main = async () => {
  console.log('---> BUILDING SUPERNOVA');
  const watcher = await build(buildArgs);
  if (buildExt) {
    buildExtension();
    if (watch) {
      watcher.on('event', (event) => {
        if (event.code === 'BUNDLE_END') {
          buildExtension();
        }
      });
    }
  }
};

main();
