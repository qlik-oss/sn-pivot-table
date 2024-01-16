/* eslint-disable import/extensions */
import serve from "@nebula.js/cli-serve";
import { expect, test } from "@playwright/test";
import fs from "fs";
import path from "path";

import config from "../../nebula.rendering.config.js";
import events from "./utils/events.mjs";
import createPlaywright from "./utils/playwright.mjs";
import createNebulaRoutes from "./utils/routes.mjs";

const dirname = path.dirname(new URL(import.meta.url).pathname);

const paths = {
  fixtures: path.resolve(dirname, "__fixtures__"),
};

// Set a small viewport size to more easily be able to trigger scenarios with "too" long labels
test.use({ viewport: { width: 720, height: 480 } });

test.describe("sn-pivot-table: Rendering tests", () => {
  let nebulaServer;
  let playwright;
  let route;

  test.beforeAll(async () => {
    nebulaServer = await serve({
      // the entry is equal to path.resolve(dirname, '../../dist/sn-pivot-table.js'),
      // so before run the testing, yarn build should run first to generate /dist
      entry: path.resolve(dirname, "../../"),
      ...config.serve,
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
    const name = file.replace(".fix.js", "");
    const fixturePath = `./${file}&theme=default`;

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
      expect(img).toMatchSnapshot({ name: `${name}.png` });
    });
  });
});
