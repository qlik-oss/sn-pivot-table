const fs = require('fs');
const path = require('path');

const validateScripts = (pkg) => {
  if (pkg.scripts.build !== 'yarn run locale:generate && node ./tools/build.js --core --ext && shx cp assets/* dist') {
    throw new Error('package.json does not have correct build script');
  }
  if (pkg.scripts.prepublishOnly !== 'NODE_ENV=production yarn run build && yarn spec') {
    throw new Error('package.json does not have correct prepublishOnly script');
  }
  if (pkg.scripts.prepack !== './tools/prepare-sn-pack.js') {
    throw new Error('package.json does not have correct prepack script');
  }
};

const validatePackageJsonContent = (pkg) => {
  // == VALIDATE package.json contents ==
  // package name
  if (!pkg.name.match(/^@nebula\.js\/sn-/)) {
    throw new Error('Bad package name. Package name should match \'@nebula.js/sn-\'');
  }

  if (!pkg.scripts) {
    throw new Error('package.json does not have any build script');
  }

  if (/--native/.test(pkg.scripts.build)) {
    throw new Error(
      'package.json build script is not allowed to use \'--native\' for a chart that is not a known native chart in Qlik Sense'
    );
  }

  validateScripts(pkg);
};

const validateFiles = (pkg) => {
  const whitelist = [
    'name',
    'version',
    'description',
    'author',
    'license',
    'keywords',
    'publishConfig',
    'bugs',
    'repository',
    'files',
    'main',
    'peerDependencies',
  ];
  // files
  const mustHaveFiles = ['dist', 'core', 'api-specifications', 'sn-pivot-table-ext'];
  const allowedFiles = ['assets', ...mustHaveFiles];
  const missing = mustHaveFiles.filter((f) => (pkg.files || []).indexOf(f) === -1);
  if (missing.length) {
    throw new Error(`package.json is missing files: ${missing.join(', ')}`);
  }
  const violates = (pkg.files || []).filter((f) => allowedFiles.indexOf(f) === -1);
  if (violates.length) {
    throw new Error(`package.json must not contain files: ${violates.join(', ')}`);
  }

  Object.keys(pkg).forEach((key) => {
    if (whitelist.indexOf(key) === -1) {
      delete pkg[key]; // eslint-disable-line no-param-reassign
    }
  });
};

// known charts that are native (build time) in Sense
const validate = (pkg, dir) => {
  validatePackageJsonContent(pkg);
  validateFiles(pkg);

  const cleanedPkg = JSON.stringify(pkg, null, 2);
  // package version must be 1.x.x at the moment
  if (!/1\.\d+\.\d+/.test(pkg.version)) {
    throw new Error('Bad package version. Package version should match 1.x.x');
  }

  // author
  if (pkg.author !== 'QlikTech International AB') {
    throw new Error('Author must be \'QlikTech International AB\'');
  }

  // license
  if (pkg.license !== 'MIT') {
    throw new Error('License must be MIT');
  }
  if (!fs.existsSync(path.resolve(dir, 'LICENSE'))) {
    throw new Error('Missing LICENSE file');
  }

  // readme
  if (!fs.existsSync(path.resolve(dir, 'README.md'))) {
    throw new Error('Missing README.md file');
  }

  return cleanedPkg;
};

module.exports = validate;
