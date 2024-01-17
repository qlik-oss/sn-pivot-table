[![CircleCI](https://circleci.com/gh/qlik-oss/sn-pivot-table.svg?style=shield)](https://circleci.com/gh/qlik-oss/sn-pivot-table)
[![Maintainability](https://api.codeclimate.com/v1/badges/3cdd48efedd802f9fccf/maintainability)](https://codeclimate.com/github/qlik-oss/sn-pivot-table/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/3cdd48efedd802f9fccf/test_coverage)](https://codeclimate.com/github/qlik-oss/sn-pivot-table/test_coverage)

# sn-pivot-table

Pivot Table supernova for [nebula.js]

More specifics and information about the sn-pivot-table can be found in [the Qlik developer portal](https://qlik.dev/libraries-and-tools/visualizations/pivot-table).

## Mashup Usage

### Installing

If you use npm:

`npm install @nebula.js/sn-pivot-table`

Or without build tool, You can also load the sn-pivot-table through the script tag from [unpkg](https://unpkg.com/@nebula.js/sn-pivot-table).

```html
<script src="https://unpkg.com/@nebula.js/sn-pivot-table"></script>
```

### Usage

```js
import { embed } from '@nebula.js/stardust';
import pivotTable from '@nebula.js/sn-pivot-table';

// 'app' is an enigma app model
const nuked = embed(app, {
  types: [{ // register the pivot table object
    name: 'pivot-table',
    load: () => Promise.resolve(pivotTable);
  }]
});

nuked.render({
  element,
  type: 'pivot-table',
});
```

### Tutorial & Examples

Look into [Build a simple mashup using nebula.js](https://qlik.dev/tutorials/build-a-simple-mashup-using-nebulajs) and [Embed a visualization](https://qlik.dev/libraries-and-tools/nebulajs/rendering) to learn more.

[Check full examples](./mashup-example) of the mashup usage.

## Visualization Extension Usage

### Building and adding the sn-pivot-table extension to Qlik Sense

Install all dependencies:

```sh
pnpm install
```

Build a nebula.js visualization as a Qlik Sense extension:

```sh
pnpm build
```

Compress the generated 'sn-pivot-table-ext' folder into the 'application/zip' file format

|                               [Saas Edition of Qlik Sense]                               |                        [Qlik Sense Enterprise]                         |                               [Qlik Sense Desktop]                               |
| :--------------------------------------------------------------------------------------: | :--------------------------------------------------------------------: | :------------------------------------------------------------------------------: |
| Copy sn-pivot-table-ext into https://your-tenant-id.us.qlikcloud.com/console/extensions/ | Copy sn-pivot-table-ext into Qlik Management Console (QMC)->Extensions | Copy sn-pivot-table-ext into ..\Users\<UserName>\Documents\Qlik\Sense\Extensions |

## API

The API can also be found in [the Qlik developer portal](https://qlik.dev/apis/javascript/nebula-pivot-table)

## Contribution

To learn how to run a sn-pivot-table extension using nebula development server and develop, see our [contributing guide](./.github/CONTRIBUTION.md).

## Package

| name             | status                                         | description                         |
| ---------------- | ---------------------------------------------- | ----------------------------------- |
| [sn-pivot-table] | [![sn-pivot-table-status]][sn-pivot-table-npm] | pivot-table supernova for nebula.js |

## License

`@nebula.js/sn-pivot-table` is [MIT licensed](./LICENSE).

[nebula.js]: https://qlik.dev/libraries-and-tools/nebulajs
[sn-pivot-table]: https://github.com/qlik-oss/sn-pivot-table
[sn-pivot-table-status]: https://img.shields.io/npm/v/@nebula.js/sn-pivot-table.svg
[sn-pivot-table-npm]: https://www.npmjs.com/package/@nebula.js/sn-pivot-table
[saas edition of qlik sense]: https://help.qlik.com/en-US/cloud-services/Subsystems/Hub/Content/Sense_Hub/Admin/mc-extensions.htm
[qlik sense enterprise]: https://help.qlik.com/en-US/sense-developer/May2021/Subsystems/Extensions/Content/Sense_Extensions/Howtos/deploy-extensions.htm
[qlik sense desktop]: https://help.qlik.com/en-US/sense-developer/May2021/Subsystems/Extensions/Content/Sense_Extensions/Howtos/deploy-extensions.htm
