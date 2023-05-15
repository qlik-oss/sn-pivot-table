const path = require("path");

const { version } = require(path.resolve(__dirname, "./package.json")); // eslint-disable-line

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
                rowTitle: {
                  color: "#404040",
                  background: "rgba(0, 0, 0, 0.03)",
                },
                columnTitle: {
                  color: "#404040",
                  background: "rgba(0, 0, 0, 0.03)",
                },
              },
              content: {
                fontSize: "12px",
                fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
                color: "rgba(0, 0, 0, 0.55)",
                background: "transparent",
                nullValue: {
                  color: "#404040",
                  background: "rgba(0, 0, 0, 0.05)",
                },
                totalValue: {
                  color: "#404040",
                  background: "transparent",
                },
              },
              rowContent: {
                fontSize: "12px",
                fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
                color: "#404040",
                background: "transparent",
                nullValue: {
                  color: "#404040",
                  background: "rgba(0, 0, 0, 0.05)",
                },
                totalLabel: {
                  color: "#404040",
                  background: "transparent",
                },
                measureLabel: {
                  color: "rgba(0, 0, 0, 0.55)",
                  background: "transparent",
                },
              },
              columnContent: {
                fontSize: "12px",
                fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
                color: "#404040",
                background: "transparent",
                nullValue: {
                  color: "#404040",
                  background: "rgba(0, 0, 0, 0.05)",
                },
                totalLabel: {
                  color: "#404040",
                  background: "transparent",
                },
                measureLabel: {
                  color: "rgba(0, 0, 0, 0.55)",
                  background: "transparent",
                },
              },
              grid: {
                rowHeight: "compact",
                lineCount: 1,
                border: "rgba(0, 0, 0, 0.15)",
                divider: "rgba(0, 0, 0, 0.6)",
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
                fontSize: "14px",
                fontFamily: "Arial",
                background: "#ccc",
                rowTitle: {
                  color: "aqua",
                  background: "blue",
                },
                columnTitle: {
                  color: "green",
                  background: "rgba(255, 120, 255, 0.5)",
                },
              },
              content: {
                fontSize: "12px",
                fontFamily: "sans-serif",
                color: "black",
                background: "salmon",
                nullValue: {
                  color: "white",
                  background: "rgba(0, 0, 0, 0.75)",
                },
                totalValue: {
                  color: "lime",
                  background: "green",
                },
              },
              rowContent: {
                fontSize: "12px",
                fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
                color: "red",
                background: "maroon",
                nullValue: {
                  color: "fuchsia",
                  background: "purple",
                },
                totalLabel: {
                  color: "chartreuse",
                  background: "brown",
                },
                measureLabel: {
                  color: "black",
                  background: "olive",
                },
              },
              columnContent: {
                fontSize: "12px",
                fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
                color: "black",
                background: "silver",
                nullValue: {
                  color: "lime",
                  background: "green",
                },
                totalLabel: {
                  color: "darkorange",
                  background: "darkorchid",
                },
                measureLabel: {
                  color: "yellow",
                  background: "olive",
                },
              },
              grid: {
                rowHeight: "compact",
                lineCount: 1,
                border: "lime",
                divider: "white",
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
                lineCount: 1,
                border: "transparent",
                divider: "rgba(0, 0, 0, 0.6)",
              },
            },
          },
        },
      },
    ],
  },
};
