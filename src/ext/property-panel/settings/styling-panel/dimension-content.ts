import { Colors } from "../../../../pivot-table/components/shared-styles";
import { createColorPickerItem } from "./utils/create-color-picker-item";
import { createFontSizeItem } from "./utils/create-font-size-item";

export const getDimensionSection = (type: "rowContent" | "columnContent") => ({
  component: "panel-section",
  translation: `properties.${type}`,
  items: {
    content: {
      component: "items",
      ref: "components",
      key: "theme",
      items: {
        fontSize: createFontSizeItem(
          `${type}.fontSize`,
          "properties.fontSize",
          (currentTheme) => currentTheme.object?.pivotTableV2?.[type]?.fontSize ?? currentTheme.fontSize
        ),
        fontColor: createColorPickerItem(
          `${type}.fontColor`,
          "properties.fontColor",
          (currentTheme) => currentTheme.object?.pivotTableV2?.[type]?.color ?? currentTheme.color
        ),
        background: createColorPickerItem(
          `${type}.background`,
          "properties.background",
          (currentTheme) => currentTheme.object?.pivotTableV2?.[type]?.background ?? Colors.Transparent
        ),

        // Null value styling
        nullValueFontColor: createColorPickerItem(
          `${type}.nullValue.fontColor`,
          "properties.nullValue.fontColor",
          (currentTheme) => currentTheme.object?.pivotTableV2?.[type]?.nullValue?.color ?? currentTheme.color
        ),
        nullValueBackground: createColorPickerItem(
          `${type}.nullValue.background`,
          "properties.nullValue.background",
          (currentTheme) => currentTheme.object?.pivotTableV2?.[type]?.nullValue?.background ?? Colors.Transparent
        ),

        // Total label styling
        totalLabelFontColor: createColorPickerItem(
          `${type}.totalLabel.fontColor`,
          "properties.totalLabel.fontColor",
          (currentTheme) => currentTheme.object?.pivotTableV2?.[type]?.totalLabel?.color ?? currentTheme.color
        ),
        totalLabelBackground: createColorPickerItem(
          `${type}.totalLabel.background`,
          "properties.totalLabel.background",
          (currentTheme) => currentTheme.object?.pivotTableV2?.[type]?.totalLabel?.background ?? Colors.Transparent
        ),
      },
    },
  },
});
