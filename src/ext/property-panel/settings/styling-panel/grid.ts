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
