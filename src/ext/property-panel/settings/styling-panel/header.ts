import { Colors } from "../../../../pivot-table/components/shared-styles";
import { createColorPickerItem } from "./utils/create-color-picker-item";
import { createFontSizeItem } from "./utils/create-font-size-item";

export const headerSection = {
  translation: "properties.Header",
  component: "panel-section",
  items: {
    headerFontItem: {
      component: "items",
      ref: "components",
      key: "theme",
      items: {
        fontSize: createFontSizeItem(
          "header.fontSize",
          "properties.fontSize",
          (currentTheme) => currentTheme.object?.pivotTableV2?.header?.fontSize ?? currentTheme.fontSize
        ),
        background: createColorPickerItem(
          "header.background",
          "properties.background",
          (currentTheme) => currentTheme.object?.pivotTableV2?.header?.background ?? Colors.Transparent
        ),

        // Row title styling
        rowTitleFontColor: createColorPickerItem(
          "header.rowTitle.fontColor",
          "properties.fontColorRowTitle",
          (currentTheme) => currentTheme.object?.pivotTableV2?.header?.rowTitle?.color ?? currentTheme.color
        ),
        rowTitleBackground: createColorPickerItem(
          "header.rowTitle.background",
          "properties.backgroundRowTitle",
          (currentTheme) => currentTheme.object?.pivotTableV2?.header?.rowTitle?.background ?? Colors.Transparent
        ),

        // Column title styling
        columnTitleFontColor: createColorPickerItem(
          "header.columnTitle.fontColor",
          "properties.fontColorColumnTitle",
          (currentTheme) => currentTheme.object?.pivotTableV2?.header?.columnTitle?.color ?? currentTheme.color
        ),
        columnTitleBackground: createColorPickerItem(
          "header.columnTitle.background",
          "properties.backgroundColumnTitle",
          (currentTheme) => currentTheme.object?.pivotTableV2?.header?.columnTitle?.background ?? Colors.Transparent
        ),
      },
    },
  },
};
