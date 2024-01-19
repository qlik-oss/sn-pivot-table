import { Colors } from "../../../../pivot-table/components/shared-styles";
import createColorPickerItem from "./utils/create-color-picker-item";
import getThemeValue from "./utils/get-theme-value";

export type SmallSection = "measureLabels" | "totalValues" | "nullValues";

interface Props {
  section: SmallSection;
  defaultFontStyle?: string[];
  fallbackBackground?: string;
}

const smallPanelSection = ({ section, defaultFontStyle, fallbackBackground }: Props) => ({
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
              (currentTheme) => getThemeValue(currentTheme, section, "color") ?? currentTheme.color,
            ),
          },
        },
        background: createColorPickerItem(
          `${section}.background`,
          "properties.background",
          (currentTheme) =>
            getThemeValue(currentTheme, section, "backgroundColor") ?? fallbackBackground ?? Colors.Transparent,
        ),
      },
    },
  },
});

export default smallPanelSection;
