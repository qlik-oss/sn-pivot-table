const path = require("path");

const pkgPath = path.resolve(__dirname, "./package.json");
const pkg = require(pkgPath); // eslint-disable-line

module.exports = {
  fromJsdoc: {
    glob: ["./src/qae/initial-properties.js"],
    package: pkgPath,
    api: {
      stability: "experimental",
      properties: {
        "x-qlik-visibility": "public",
      },
      visibility: "public",
      name: `${pkg.name}:properties`,
      version: pkg.version,
      description: "Pivot Table generic object definition",
    },
    output: {
      file: path.resolve(__dirname, "./api-specifications/properties.json"),
    },
    parse: {
      types: {
        GenericObjectProperties: {
          url: "https://qlik.dev/apis/json-rpc/qix/schemas#%23%2Fdefinitions%2Fschemas%2Fentries%2FGenericObjectProperties",
        },
        NxDimension: {
          url: "https://qlik.dev/apis/json-rpc/qix/schemas#%23%2Fdefinitions%2Fschemas%2Fentries%2FNxDimension",
        },
        NxMeasure: {
          url: "https://qlik.dev/apis/json-rpc/qix/schemas#%23%2Fdefinitions%2Fschemas%2Fentries%2FNxMeasure",
        },
        NxInlineDimensionDef: {
          url: "https://qlik.dev/apis/json-rpc/qix/schemas#%23%2Fdefinitions%2Fschemas%2Fentries%2FNxInlineDimensionDef",
        },
        NxInlinedMeasureDef: {
          url: "https://qlik.dev/apis/json-rpc/qix/schemas#%23%2Fdefinitions%2Fschemas%2Fentries%2FNxInlineMeasureDef",
        },
        HyperCubeDef: {
          url: "https://qlik.dev/apis/json-rpc/qix/schemas#%23%2Fdefinitions%2Fschemas%2Fentries%2FHyperCubeDef",
        },
        StringExpression: {
          url: "https://qlik.dev/apis/json-rpc/qix/schemas/#%23%2Fdefinitions%2Fschemas%2Fentries%2FStringExpression",
        },
      },
    },
  },
};
