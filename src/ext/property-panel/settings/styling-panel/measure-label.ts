import { Colors } from "../../../../pivot-table/components/shared-styles";
import createColorPickerItem from "./utils/create-color-picker-item";

const measureLabelsSection = () => ({
  component: "panel-section",
  translation: "properties.measureLabels",
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
              ref: "measureLabel.fontStyle",
              defaultValue: [],
            },
            fontColor: createColorPickerItem(
              "measureLabel.fontColor",
              undefined,
              (currentTheme) => currentTheme.object?.pivotTableV2?.measureLabel?.color ?? currentTheme.color,
            ),
          },
        },
        background: createColorPickerItem(
          "measureLabel.background",
          "properties.background",
          (currentTheme) => currentTheme.object?.pivotTableV2?.measureLabel?.background ?? Colors.Transparent,
        ),
      },
    },
  },
});

export default measureLabelsSection;
