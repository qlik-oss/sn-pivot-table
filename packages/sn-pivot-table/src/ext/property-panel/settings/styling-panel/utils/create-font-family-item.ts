import type { stardust } from "@nebula.js/stardust";
import { getAvailableFonts } from "qlik-chart-modules";
import { DEFAULT_FONT_FAMILY } from "../../../../../pivot-table/constants";
import type { Args, CurrentTheme } from "../../../../../types/QIX";
import type { Flags } from "../../../../../types/types";
import { toValueLabel } from "./to-value-label";

export type ThemeAccessor = (currentTheme: CurrentTheme) => string;

interface Props {
  ref: string;
  themeAccessor: ThemeAccessor;
  translator: stardust.Translator;
  flags: Flags;
}

const getFontFamilies = (
  currentValue: string,
  currentTheme: CurrentTheme,
  translator: stardust.Translator,
  flags: Flags,
) => {
  const defaultThemeFontFamily = currentTheme.fontFamily ?? DEFAULT_FONT_FAMILY;
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
    ...getAvailableFonts(flags)
      .filter((fontFamily) => !themeFontFamilies.includes(fontFamily))
      .map((fontFamily) => toValueLabel(fontFamily, true)),
  ];

  return [...themeSection, ...(allFontsSection.length > 1 ? allFontsSection : [])];
};

const createFontFamilyItem = ({ ref, themeAccessor, translator, flags }: Props) => ({
  component: "dropdown",
  ref,
  options: (data: unknown, handler: unknown, args: Args) => {
    const currentTheme = args.theme.current();
    const currentValue = themeAccessor(currentTheme);
    return getFontFamilies(currentValue, currentTheme, translator, flags);
  },
  defaultValue: (data: unknown, handler: unknown, args: Args) => themeAccessor(args.theme.current()),
});

export default createFontFamilyItem;
