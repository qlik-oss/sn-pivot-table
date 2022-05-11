/* eslint-disable no-console */
const logLevels = [
  // 'info',
  // 'log',
  'warn',
  'error',
];

async function consoleEvent(msg) {
  if (logLevels.indexOf(msg.type()) >= 0) {
    const resolvedArgs = await Promise.all(msg.args().map((arg) => arg.jsonValue()));
    console[msg.type()](...resolvedArgs);
  }
}

function pageerrorEvent(msg) {
  console.error(msg);
}

export default {
  addListeners(page) {
    page.on('console', consoleEvent);
    page.on('pageerror', pageerrorEvent);
  },
  removeListeners(page) {
    page.removeListener('console', consoleEvent);
    page.removeListener('pageerror', pageerrorEvent);
  },
};
