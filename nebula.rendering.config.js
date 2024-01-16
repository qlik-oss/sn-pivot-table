module.exports = {
  serve: {
    type: "sn-pivot-table",
    build: false,
    open: false,
    fixturePath: "test/rendering/__fixtures__",
    flags: {},
    keyboardNavigation: false,
    themes: [
      {
        id: "default",
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
                backgroundColor: "transparent",
                borderColor: "rgba(0, 0, 0, 0.15)",
                divider: {
                  borderColor: "rgba(0, 0, 0, 0.6)",
                },
              },
            },
          },
        },
      },
    ],
  },
};
