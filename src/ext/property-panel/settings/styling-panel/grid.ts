export const gridSection = {
  translation: "properties.filterpane.grid",
  component: "panel-section",
  items: {
    rowHeightItem: {
      component: "items",
      ref: "components",
      key: "theme",
      items: {
        rowHeightWrapper: {
          component: "inline-wrapper",
          items: {
            rowHeight: {
              component: "dropdown",
              ref: "grid.lineCount",
              translation: "ThemeStyleEditor.style.rowHeight",
              options: [...Array(10).keys()].map((x) => ({
                value: x + 1,
                translation: x + 1,
              })),
              defaultValue: 1,
            },
          },
        },
      },
    },
  },
};
