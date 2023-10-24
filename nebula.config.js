const path = require("path");

const { version } = require(path.resolve(__dirname, "./package.json")); // eslint-disable-line

const randomColor = () => {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  const a = Math.random() * 0.5 + 0.5;
  return `rgba(${r},${g},${b},${a})`;
};

module.exports = {
  build: {
    typescript: true,
    replacementStrings: {
      "process.env.PACKAGE_VERSION": JSON.stringify(version),
    },
  },
  serve: {
    flags: {},
    keyboardNavigation: false,
    themes: [
      {
        id: "Default",
        theme: {
          object: {
            pivotTableV2: {
              header: {
                fontSize: "12px",
                fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
                background: "transparent",
                color: "#404040",
              },
              measureValues: {
                fontSize: "12px",
                fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
                color: "rgba(0, 0, 0, 0.55)",
                background: "transparent",
              },
              dimensionValues: {
                fontSize: "12px",
                fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
                color: "#404040",
                background: "transparent",
              },
              measureLabels: {
                color: "rgba(0, 0, 0, 0.55)",
                background: "transparent",
              },
              nullValues: {
                color: "#404040",
                background: "rgba(0, 0, 0, 0.05)",
              },
              totalValues: {
                color: "#404040",
                background: "transparent",
              },
              grid: {
                lineClamp: 1,
                rowHeight: "compact",
                border: "rgba(0, 0, 0, 0.15)",
                divider: "rgba(0, 0, 0, 0.6)",
                background: "transparent",
              },
            },
          },
        },
      },
      {
        id: "Demo",
        theme: {
          object: {
            pivotTableV2: {
              header: {
                fontSize: "16px",
                fontFamily: "Arial",
                background: "maroon",
                color: "fuchsia",
              },
              measureValues: {
                fontSize: "10px",
                fontFamily: "Verdana",
                color: "lime",
                background: "green",
              },
              dimensionValues: {
                fontSize: "14px",
                fontFamily: "sans-serif",
                color: "olive",
                background: "aqua",
              },
              measureLabels: {
                color: "black",
                background: "yellow",
              },
              nullValues: {
                color: "white",
                background: "orange",
              },
              totalValues: {
                color: "darkblue",
                background: "crimson",
              },
              grid: {
                lineClamp: 1,
                rowHeight: "compact",
                border: "darkviolet",
                divider: "darkred",
                background: "transparent",
              },
            },
          },
        },
      },
      {
        id: "Only transparent borders",
        theme: {
          object: {
            pivotTableV2: {
              grid: {
                rowHeight: "compact",
                border: "transparent",
                divider: "rgba(0, 0, 0, 0.6)",
              },
            },
          },
        },
      },
      {
        id: "Line clamp",
        theme: {
          object: {
            pivotTableV2: {
              grid: {
                lineClamp: 10,
              },
            },
          },
        },
      },
      {
        id: "Random Color",
        theme: {
          object: {
            pivotTableV2: {
              header: {
                fontSize: "12px",
                fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
                background: randomColor(),
                color: randomColor(),
              },
              measureValues: {
                fontSize: "12px",
                fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
                color: randomColor(),
                background: randomColor(),
              },
              dimensionValues: {
                fontSize: "12px",
                fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
                color: randomColor(),
                background: randomColor(),
              },
              measureLabels: {
                color: randomColor(),
                background: randomColor(),
              },
              nullValues: {
                color: randomColor(),
                background: randomColor(),
              },
              totalValues: {
                color: randomColor(),
                background: randomColor(),
              },
              grid: {
                lineClamp: 1,
                rowHeight: "compact",
                border: randomColor(),
                divider: randomColor(),
                background: randomColor(),
              },
            },
          },
        },
      },
    ],
  },
};
