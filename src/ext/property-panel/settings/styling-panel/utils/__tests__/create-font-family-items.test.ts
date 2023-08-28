import type { stardust } from "@nebula.js/stardust";
import { DEFAULT_FONT_FAMILY } from "../../../../../../pivot-table/constants";
import type { Args, CurrentTheme } from "../../../../../../types/QIX";
import createFontFamilyItem, { DEFAULT_FONT_FAMILIES, type ThemeAccessor } from "../create-font-family-item";

describe("createFontFamilyItem", () => {
  const translator = { get: (str: string) => str } as stardust.Translator;
  let args: Args;
  let themeAccessor: ThemeAccessor;
  const fontFamily = "Test family";
  const themeAccessorFontFamily = "Theme family";
  let fontFamilies: string[] | undefined = ["Test families"];

  beforeEach(() => {
    themeAccessor = () => themeAccessorFontFamily;
    args = {
      theme: {
        current: () =>
          ({
            fontFamily,
            fontFamilies,
          }) as CurrentTheme,
      },
    };
  });

  test("should include font family from default fonts", () => {
    const def = createFontFamilyItem({
      ref: "someRef",
      themeAccessor,
      translator,
    });

    expect(def.ref).toEqual("someRef");
    expect(def.defaultValue(null, null, args)).toEqual(themeAccessorFontFamily);
    expect(def.options(null, null, args)).toEqual([
      {
        value: "ThemeHeader",
        label: "properties.themeFonts",
        metaText: "properties.theme",
        groupHeader: true,
      },
      {
        value: "Test families",
        label: "Test families",
        groupHeader: false,
        disabled: false,
      },
      {
        value: "Test family",
        label: "Test family",
        groupHeader: false,
        disabled: false,
      },
      {
        value: "Theme family",
        label: "Theme family",
        groupHeader: false,
        disabled: false,
      },
      {
        value: "DefaultHeader",
        label: "properties.allFonts",
        metaText: "properties.default",
        groupHeader: true,
      },
      {
        value: "American Typewriter, serif",
        label: "American Typewriter, serif",
        groupHeader: false,
        disabled: false,
      },
      {
        value: "Andalé Mono, monospace",
        label: "Andalé Mono, monospace",
        groupHeader: false,
        disabled: false,
      },
      {
        value: "Arial Black, sans-serif",
        label: "Arial Black, sans-serif",
        groupHeader: false,
        disabled: false,
      },
      {
        value: "Arial, sans-serif",
        label: "Arial, sans-serif",
        groupHeader: false,
        disabled: false,
      },
      {
        value: "Bradley Hand, cursive",
        label: "Bradley Hand, cursive",
        groupHeader: false,
        disabled: false,
      },
      {
        value: "Brush Script MT, cursive",
        label: "Brush Script MT, cursive",
        groupHeader: false,
        disabled: false,
      },
      {
        value: "Comic Sans MS, cursive",
        label: "Comic Sans MS, cursive",
        groupHeader: false,
        disabled: false,
      },
      {
        value: "Courier, monospace",
        label: "Courier, monospace",
        groupHeader: false,
        disabled: false,
      },
      {
        value: "Didot, serif",
        label: "Didot, serif",
        groupHeader: false,
        disabled: false,
      },
      {
        value: "Georgia, serif",
        label: "Georgia, serif",
        groupHeader: false,
        disabled: false,
      },
      {
        value: "Impact, sans-serif",
        label: "Impact, sans-serif",
        groupHeader: false,
        disabled: false,
      },
      {
        value: "Lucida Console, monospace",
        label: "Lucida Console, monospace",
        groupHeader: false,
        disabled: false,
      },
      {
        value: "Luminari, fantasy",
        label: "Luminari, fantasy",
        groupHeader: false,
        disabled: false,
      },
      {
        value: "Monaco, monospace",
        label: "Monaco, monospace",
        groupHeader: false,
        disabled: false,
      },
      {
        value: "QlikView Sans, sans-serif",
        label: "QlikView Sans, sans-serif",
        groupHeader: false,
        disabled: false,
      },
      {
        value: "Source Sans Pro, Arial, sans-serif",
        label: "Source Sans Pro, Arial, sans-serif",
        groupHeader: false,
        disabled: false,
      },
      {
        value: "Source Sans Pro, sans-serif",
        label: "Source Sans Pro, sans-serif",
        groupHeader: false,
        disabled: false,
      },
      {
        value: "Tahoma, sans-serif",
        label: "Tahoma, sans-serif",
        groupHeader: false,
        disabled: false,
      },
      {
        value: "Times New Roman, serif",
        label: "Times New Roman, serif",
        groupHeader: false,
        disabled: false,
      },
      {
        value: "Trebuchet MS, sans-serif",
        label: "Trebuchet MS, sans-serif",
        groupHeader: false,
        disabled: false,
      },
      {
        value: "Verdana, sans-serif",
        label: "Verdana, sans-serif",
        groupHeader: false,
        disabled: false,
      },
    ]);
  });

  test("should remove duplicated font families from Theme section", () => {
    fontFamilies = [fontFamily];
    themeAccessor = () => fontFamily;

    const def = createFontFamilyItem({
      ref: "someRef",
      themeAccessor,
      translator,
    });

    expect(def.defaultValue(null, null, args)).toEqual(fontFamily);
    expect(def.options(null, null, args).filter((f) => f.value === fontFamily)).toEqual([
      {
        value: fontFamily,
        label: fontFamily,
        groupHeader: false,
        disabled: false,
      },
    ]);
  });

  test("should remove duplicated font families from Default section", () => {
    fontFamilies = [DEFAULT_FONT_FAMILY];

    const def = createFontFamilyItem({
      ref: "someRef",
      themeAccessor,
      translator,
    });

    expect(def.options(null, null, args).filter((f) => f.value === DEFAULT_FONT_FAMILY)).toEqual([
      {
        value: DEFAULT_FONT_FAMILY,
        label: DEFAULT_FONT_FAMILY,
        groupHeader: false,
        disabled: false,
      },
    ]);
  });

  test("should remove Default section if there are no unique font families", () => {
    fontFamilies = DEFAULT_FONT_FAMILIES;

    const def = createFontFamilyItem({
      ref: "someRef",
      themeAccessor,
      translator,
    });

    const options = def.options(null, null, args);
    expect(options.filter((f) => f.value === "ThemeHeader")).toEqual([
      {
        value: "ThemeHeader",
        label: "properties.themeFonts",
        metaText: "properties.theme",
        groupHeader: true,
      },
    ]);
    expect(options.filter((f) => f.value === "DefaultHeader")).toEqual([]);
  });

  test("should handle when fontFamilies is undefined", () => {
    fontFamilies = undefined;

    const def = createFontFamilyItem({
      ref: "someRef",
      themeAccessor,
      translator,
    });

    expect(def.defaultValue(null, null, args)).toEqual(themeAccessorFontFamily);
    expect(
      def.options(null, null, args).filter((f) => f.value === fontFamily || f.value === themeAccessorFontFamily),
    ).toEqual([
      {
        value: fontFamily,
        label: fontFamily,
        groupHeader: false,
        disabled: false,
      },
      {
        value: themeAccessorFontFamily,
        label: themeAccessorFontFamily,
        groupHeader: false,
        disabled: false,
      },
    ]);
  });
});
