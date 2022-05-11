import fs from 'fs';
import path from 'path';
import serve from '@nebula.js/cli-serve';
import { test, expect } from '@playwright/test';

import events from './utils/events.mjs';
import createNebulaRoutes from './utils/routes.mjs';
import createPlaywright from './utils/playwright.mjs';

const dirname = path.dirname(new URL(import.meta.url).pathname);

const paths = {
  fixtures: path.resolve(dirname, '__fixtures__'),
};

test.describe('sn-pivot-table: Rendering tests', () => {
  let nebulaServer;
  let playwright;
  let route;

  test.beforeAll(async () => {
    nebulaServer = await serve({
      // the entry is equal to path.resolve(dirname, '../../dist/sn-pivot-table.js'),
      // so before run the testing, yarn build should run first to generate /dist
      entry: path.resolve(dirname, '../../'),
      type: 'sn-pivot-table',
      open: false,
      build: false,
      themes: [],
      fixturePath: 'test/rendering/__fixtures__',
    });
    route = createNebulaRoutes(nebulaServer.url);
  });

  test.beforeEach(({ page }) => events.addListeners(page));

  test.afterEach(({ page }) => events.removeListeners(page));

  test.afterAll(async () => {
    nebulaServer.close();
  });

  // Iterate testing fixture files
  fs.readdirSync(paths.fixtures).forEach((file) => {
    const name = file.replace('.fix.js', '');
    const fixturePath = `./${file}`;

    // Create test case per testing fixture file
    test(name, async ({ page }) => {
      playwright = createPlaywright(page);
      // Render chart based on testing fixture file
      // in Nebula serve using Enigma mocker
      const renderUrl = await route.renderFixture(fixturePath);
      console.log({ renderUrl });
      // Open page in Nebula which renders fixture
      await playwright.open(renderUrl);
      // Puppeteer Capture screenshot
      const img = await playwright.screenshot();
      // Compare screenshot with baseline image
      expect(img).toMatchSnapshot(`${name}.png`);
    });
  });
});
