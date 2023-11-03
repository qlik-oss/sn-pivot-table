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
              dimension: {
                label: {
                  name: {
                    fontSize: "12px",
                    fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
                    backgroundColor: "transparent",
                    color: "#404040",
                  },
                  value: {
                    fontSize: "12px",
                    fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
                    color: "#404040",
                    backgroundColor: "transparent",
                  },
                },
              },
              measure: {
                label: {
                  name: {
                    color: "rgba(0, 0, 0, 0.55)",
                    backgroundColor: "transparent",
                  },
                  value: {
                    fontSize: "12px",
                    fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
                    color: "rgba(0, 0, 0, 0.55)",
                    backgroundColor: "transparent",
                  },
                },
              },
              total: {
                label: {
                  value: {
                    color: "#404040",
                    backgroundColor: "transparent",
                  },
                },
              },
              null: {
                label: {
                  value: {
                    color: "#404040",
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                  },
                },
              },
              grid: {
                lineClamp: 1,
                borderColor: "rgba(0, 0, 0, 0.15)",
                divider: {
                  borderColor: "rgba(0, 0, 0, 0.6)",
                },
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
              dimension: {
                label: {
                  name: {
                    fontSize: "16px",
                    fontFamily: "Arial",
                    backgroundColor: "maroon",
                    color: "fuchsia",
                  },
                  value: {
                    fontSize: "14px",
                    fontFamily: "sans-serif",
                    color: "olive",
                    backgroundColor: "aqua",
                  },
                },
              },
              measure: {
                label: {
                  name: {
                    color: "black",
                    backgroundColor: "yellow",
                  },
                  value: {
                    fontSize: "10px",
                    fontFamily: "Verdana",
                    color: "lime",
                    backgroundColor: "green",
                  },
                },
              },
              total: {
                label: {
                  value: {
                    color: "darkblue",
                    backgroundColor: "crimson",
                  },
                },
              },
              null: {
                label: {
                  value: {
                    color: "white",
                    backgroundColor: "orange",
                  },
                },
              },
              grid: {
                lineClamp: 1,
                borderColor: "darkviolet",
                backgroundColor: "salmon",
                divider: {
                  borderColor: "red",
                },
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
                borderColor: "transparent",
                divider: {
                  borderColor: "rgba(0, 0, 0, 0.6)",
                },
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
              dimension: {
                label: {
                  name: {
                    fontSize: "12px",
                    fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
                    backgroundColor: randomColor(),
                    color: randomColor(),
                  },
                  value: {
                    fontSize: "12px",
                    fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
                    color: randomColor(),
                    backgroundColor: randomColor(),
                  },
                },
              },
              measure: {
                label: {
                  name: {
                    color: randomColor(),
                    backgroundColor: randomColor(),
                  },
                  value: {
                    fontSize: "12px",
                    fontFamily: '"Source Sans Pro", "Arial", "sans-serif"',
                    color: randomColor(),
                    backgroundColor: randomColor(),
                  },
                },
              },
              total: {
                label: {
                  value: {
                    color: randomColor(),
                    backgroundColor: randomColor(),
                  },
                },
              },
              null: {
                label: {
                  value: {
                    color: randomColor(),
                    backgroundColor: randomColor(),
                  },
                },
              },
              grid: {
                lineClamp: 1,
                backgroundColor: randomColor(),
                borderColor: randomColor(),
                divider: {
                  borderColor: randomColor(),
                },
              },
            },
          },
        },
      },
    ],
  },
};
