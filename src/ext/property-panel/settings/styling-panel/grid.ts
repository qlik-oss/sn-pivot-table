import { Colors } from "../../../../pivot-table/components/shared-styles";
import createColorPickerItem from "./utils/create-color-picker-item";

const gridSection = {
  translation: "properties.pivot.grid",
  component: "panel-section",
  items: {
    rowHeightItem: {
      component: "items",
      ref: "components",
      key: "theme",
      items: {
        lineClamp: {
          component: "inline-wrapper",
          items: {
            rowHeight: {
              component: "dropdown",
              ref: "grid.lineClamp",
              translation: "ThemeStyleEditor.style.rowHeight",
              options: [...Array(10).keys()].map((x) => ({
                value: x + 1,
                translation: x + 1,
              })),
              defaultValue: 1,
            },
          },
        },
        border: createColorPickerItem(
          "grid.border",
          "properties.border",
          (currentTheme) => currentTheme.object?.pivotTableV2?.grid?.border ?? Colors.Black15,
        ),
        divider: createColorPickerItem(
          "grid.divider",
          "properties.pivot.divider",
          (currentTheme) => currentTheme.object?.pivotTableV2?.grid?.divider ?? Colors.Black60,
        ),
        background: createColorPickerItem(
          "grid.background",
          "properties.background",
          (currentTheme) => currentTheme.object?.pivotTableV2?.header?.background ?? Colors.Transparent,
        ),
      },
    },
  },
};

export default gridSection;
