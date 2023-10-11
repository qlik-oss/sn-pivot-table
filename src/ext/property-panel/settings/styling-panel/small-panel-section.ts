import { Colors } from "../../../../pivot-table/components/shared-styles";
import createColorPickerItem from "./utils/create-color-picker-item";

interface Props {
  section: "measureLabels" | "totalValues" | "nullValues";
  defaultFontStyle?: string[];
}

const getFallbackBackground = (section: string) => (section === "nullValues" ? Colors.Black5 : Colors.Transparent);

const smallPanelSection = ({ section, defaultFontStyle }: Props) => ({
  component: "panel-section",
  translation: `properties.pivot.${section}`,
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
              ref: `${section}.fontStyle`,
              defaultValue: defaultFontStyle ?? [],
            },
            fontColor: createColorPickerItem(
              `${section}.fontColor`,
              undefined,
              (currentTheme) => currentTheme.object?.pivotTableV2?.[section]?.color ?? currentTheme.color,
            ),
          },
        },
        background: createColorPickerItem(
          `${section}.background`,
          "properties.background",
          (currentTheme) => currentTheme.object?.pivotTableV2?.[section]?.background ?? getFallbackBackground(section),
        ),
      },
    },
  },
});

export default smallPanelSection;
