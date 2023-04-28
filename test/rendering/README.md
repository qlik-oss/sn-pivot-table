# Rendering Test

## Overview

Nebula development serve uses [mocked Qlik core engine (Enigma mocker)](https://github.com/qlik-oss/nebula.js/blob/master/apis/enigma-mocker/README.md) to render the sn-pivot-table based on the [testing fixture files](https://github.com/qlik-oss/nebula.js/tree/master/commands/serve/docs).

Testing cases use [Playwright](https://playwright.dev/) to capture screenshots of those rendered charts and matches against baseline to ensure our charts look as intended.

Visual regression testing flow:

1. Start Nebula development serve and launch Playwright
2. Iterate testing fixture files
3. Create test case per testing fixture file
4. Render a chart based on testing fixture file in Nebula serve using Enigma mocker
5. Capture screenshot by Playwright
6. Compare screenshot with baseline image

To capture same screenshot on the same operating system both locally and on a CI server, we use a docker instance to take the contents of `dist` and start a http-server. The rendering tests then run on your local machine or on the CI server.

## Updating snapshots

If you've updated the UI, you need to run the update-screenshots.sh script:

    # Install dependencies
    yarn --frozen-lockfile

    # Build nebula.js visualization
    yarn build

    chmod 777 ./test/rendering/scripts/update-screenshots.sh
    yarn test:local:update:screenshots

It will spin up a docker container with playwright and enable us to emulate our CI server for updating the reference screenshots. The `--update-snapshots` will generate new screenshots for you.

Make sure to commit these after you've **confirmed the screenshot changes**.

Sometimes tests might break, if you are certain no UI changes have been made just re-run the failed workflow.

## Test cases description

### scenario_1.fix.js

2 dimension as rows and measure group (pseudo dimension) also as row.

### scenario_2.fix.js

1 dimension as row, 1 dimension as column and measure group (pseudo dimension) as column. Also a custom null value text.

### scenario_3.fix.js

1 dimension as column and 1 measure as column.

### scenario_4.fix.js

2 dimension as rows, first dimension have an expanded value.

### scenario_11.fix.js

Has a faked "qSize.qcx" to trigger the max column limit and show a disclaimer.
