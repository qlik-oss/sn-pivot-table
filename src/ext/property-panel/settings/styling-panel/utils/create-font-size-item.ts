import type { stardust } from "@nebula.js/stardust";
import type { Args, CurrentTheme } from "../../../../../types/QIX";
import { toValueLabel } from "./to-value-label";

type ThemeAccessor = (currentTheme: CurrentTheme) => string;

interface Props {
  ref: string;
  themeAccessor: ThemeAccessor;
  translator: stardust.Translator;
}

const DEFAULT_FONT_SIZES: string[] = [
  "10px",
  "11px",
  "12px",
  "13px",
  "14px",
  "15px",
  "16px",
  "17px",
  "18px",
  "19px",
  "20px",
  "21px",
  "22px",
  "23px",
  "24px",
];

const getFontSizes = (currentValue: string, currentTheme: CurrentTheme, translator: stardust.Translator) => {
  const defaultThemeFontSize = currentTheme.fontSize;
  const customFontSizes = currentTheme.fontSizes ?? [];
  const themeFontSizes = Array.from(new Set([currentValue, defaultThemeFontSize, ...customFontSizes]));
  const themeSection = [
    {
      value: "ThemeHeader",
      label: translator.get("properties.themeFontSizes"),
      metaText: translator.get("properties.theme"),
      groupHeader: true,
    },
    ...themeFontSizes
      .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
      .map((fontSize) => toValueLabel(fontSize, false)),
  ];
  const allSizesSection = [
    {
      value: "DefaultHeader",
      label: translator.get("properties.allFontSizes"),
      metaText: translator.get("properties.default"),
      groupHeader: true,
    },
    ...DEFAULT_FONT_SIZES.filter((fontSize) => !themeFontSizes.includes(fontSize)).map((fontSize) =>
      toValueLabel(fontSize, false)
    ),
  ];

  return [...themeSection, ...(allSizesSection.length > 1 ? allSizesSection : [])];
};

const createFontSizeItem = ({ ref, themeAccessor, translator }: Props) => ({
  component: "dropdown",
  ref,
  options: (data: unknown, handler: unknown, args: Args) => {
    const currentTheme = args.theme.current();
    const currentValue = themeAccessor(currentTheme);
    return getFontSizes(currentValue, currentTheme, translator);
  },
  defaultValue: (data: unknown, handler: unknown, args: Args) => themeAccessor(args.theme.current()),
});

export default createFontSizeItem;
