import type { stardust } from "@nebula.js/stardust";
import { DEFAULT_FONT_FAMILY } from "../../../../../pivot-table/constants";
import type { Args, CurrentTheme } from "../../../../../types/QIX";
import { toValueLabel } from "./to-value-label";

type ThemeAccessor = (currentTheme: CurrentTheme) => string;

interface Props {
  ref: string;
  themeAccessor: ThemeAccessor;
  translator: stardust.Translator;
}

const DEFAULT_FONT_FAMILIES: string[] = [
  "American Typewriter, serif",
  "Andalé Mono, monospace",
  "Arial Black, sans-serif",
  "Arial, sans-serif",
  "Bradley Hand, cursive",
  "Brush Script MT, cursive",
  "Comic Sans MS, cursive",
  "Courier, monospace",
  "Didot, serif",
  "Georgia, serif",
  "Impact, sans-serif",
  "Lucida Console, monospace",
  "Luminari, fantasy",
  "Monaco, monospace",
  "QlikView Sans, sans-serif",
  DEFAULT_FONT_FAMILY,
  "Source Sans Pro, sans-serif",
  "Tahoma, sans-serif",
  "Times New Roman, serif",
  "Trebuchet MS, sans-serif",
  "Verdana, sans-serif",
];

const getFontFamilies = (currentValue: string, currentTheme: CurrentTheme, translator: stardust.Translator) => {
  const defaultThemeFontFamily = currentTheme.fontFamily;
  const customFontFamilies = currentTheme.fontFamilies ?? [];
  const themeFontFamilies = Array.from(new Set([currentValue, defaultThemeFontFamily, ...customFontFamilies]));

  const themeSection = [
    {
      value: "ThemeHeader",
      label: translator.get("properties.themeFonts"),
      metaText: translator.get("properties.theme"),
      groupHeader: true,
    },
    ...themeFontFamilies.sort().map((fontSize) => toValueLabel(fontSize, true)),
  ];
  const allFontsSection = [
    {
      value: "DefaultHeader",
      label: translator.get("properties.allFonts"),
      metaText: translator.get("properties.default"),
      groupHeader: true,
    },
    ...DEFAULT_FONT_FAMILIES.filter((fontFamily) => !themeFontFamilies.includes(fontFamily)).map((fontFamily) =>
      toValueLabel(fontFamily, true)
    ),
  ];

  return [...themeSection, ...(allFontsSection.length > 1 ? allFontsSection : [])];
};

export const createFontFamilyItem = ({ ref, themeAccessor, translator }: Props) => ({
  component: "dropdown",
  ref,
  options: (data: unknown, handler: unknown, args: Args) => {
    const currentTheme = args.theme.current();
    const currentValue = themeAccessor(currentTheme);
    return getFontFamilies(currentValue, currentTheme, translator);
  },
  defaultValue: (data: unknown, handler: unknown, args: Args) => themeAccessor(args.theme.current()),
});
