#! /usr/bin/env node

const path = require('path');
const fs = require('fs');
const validate = require('./validate-nebula-package');

const p = path.resolve(process.cwd(), 'package.json');
const cleanedPkg = validate(require(p), process.cwd()); // eslint-disable-line
fs.writeFileSync(p, cleanedPkg);
