import { Colors } from "../../../../pivot-table/components/shared-styles";
import createColorPickerItem from "./utils/create-color-picker-item";

const nullValuesSection = () => ({
  component: "panel-section",
  translation: "library.colors.nullvalues",
  items: {
    content: {
      component: "items",
      ref: "components",
      key: "theme",
      items: {
        fontWrapperItem: {
          component: "inline-wrapper",
          items: {
            fontStyle: {
              component: "font-style-buttons",
              fullWidth: true,
              ref: "nullValue.fontStyle",
              defaultValue: [],
            },
            fontColor: createColorPickerItem(
              "nullValue.fontColor",
              undefined,
              (currentTheme) => currentTheme.object?.pivotTableV2?.nullValue?.color ?? currentTheme.color,
            ),
          },
        },
        background: createColorPickerItem(
          "nullValue.background",
          "properties.background",
          (currentTheme) => currentTheme.object?.pivotTableV2?.nullValue?.background ?? Colors.Transparent,
        ),
      },
    },
  },
});

export default nullValuesSection;
