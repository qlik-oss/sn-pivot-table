import { Colors } from "../../../../pivot-table/components/shared-styles";
import createColorPickerItem from "./utils/create-color-picker-item";

const totalValuesSection = () => ({
  component: "panel-section",
  translation: "properties.pivot.totalValues",
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
              ref: "totalValue.fontStyle",
              defaultValue: ["bold"],
            },
            fontColor: createColorPickerItem(
              "totalValue.fontColor",
              undefined,
              (currentTheme) => currentTheme.object?.pivotTableV2?.totalValue?.color ?? currentTheme.color,
            ),
          },
        },
        background: createColorPickerItem(
          "totalValue.background",
          "properties.background",
          (currentTheme) => currentTheme.object?.pivotTableV2?.totalValue?.background ?? Colors.Transparent,
        ),
      },
    },
  },
});

export default totalValuesSection;
