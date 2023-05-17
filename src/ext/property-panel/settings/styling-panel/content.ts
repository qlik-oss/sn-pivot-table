import { Colors } from "../../../../pivot-table/components/shared-styles";
import { createColorPickerItem } from "./utils/create-color-picker-item";
import { createFontSizeItem } from "./utils/create-font-size-item";

export const contentSection = {
  component: "panel-section",
  translation: "properties.Content",
  items: {
    content: {
      component: "items",
      ref: "components",
      key: "theme",
      items: {
        fontSize: createFontSizeItem(
          "content.fontSize",
          "properties.fontSize",
          (currentTheme) => currentTheme.object?.pivotTableV2?.content?.fontSize ?? currentTheme.fontSize
        ),
        fontColor: createColorPickerItem(
          "content.fontColor",
          "properties.fontColor",
          (currentTheme) => currentTheme.object?.pivotTableV2?.content?.color ?? currentTheme.color
        ),
        background: createColorPickerItem(
          "content.background",
          "properties.background",
          (currentTheme) => currentTheme.object?.pivotTableV2?.content?.background ?? Colors.Transparent
        ),

        // Null value styling
        nullValueFontColor: createColorPickerItem(
          "content.nullValue.fontColor",
          "properties.nullValue.fontColor",
          (currentTheme) => currentTheme.object?.pivotTableV2?.content?.nullValue?.color ?? currentTheme.color
        ),
        nullValueBackground: createColorPickerItem(
          "content.nullValue.background",
          "properties.nullValue.background",
          (currentTheme) => currentTheme.object?.pivotTableV2?.content?.nullValue?.background ?? Colors.Transparent
        ),

        // Total value styling
        totalValueFontColor: createColorPickerItem(
          "content.totalValue.fontColor",
          "properties.totalValue.fontColor",
          (currentTheme) => currentTheme.object?.pivotTableV2?.content?.totalValue?.color ?? currentTheme.color
        ),
        totalValueBackground: createColorPickerItem(
          "content.totalValue.background",
          "properties.totalValue.background",
          (currentTheme) => currentTheme.object?.pivotTableV2?.content?.totalValue?.background ?? Colors.Transparent
        ),
      },
    },
  },
};
