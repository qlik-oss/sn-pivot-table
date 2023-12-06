import type { stardust } from "@nebula.js/stardust";
import * as qlikChartModules from "qlik-chart-modules";
import { DEFAULT_FONT_FAMILY } from "../../../../../../pivot-table/constants";
import type { Args, CurrentTheme } from "../../../../../../types/QIX";
import type { Flags } from "../../../../../../types/types";
import createFontFamilyItem, { type ThemeAccessor } from "../create-font-family-item";

jest.mock("qlik-chart-modules");

describe("createFontFamilyItem", () => {
  const translator = { get: (str: string) => str } as stardust.Translator;
  let args: Args;
  let themeAccessor: ThemeAccessor;
  const fontFamily = "Test family";
  const themeAccessorFontFamily = "Theme family";
  const defaultSharedFont = "Default shared font";
  const flags: Flags = { isEnabled: () => true };
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

    jest.spyOn(qlikChartModules, "getAvailableFonts").mockImplementation(() => [defaultSharedFont]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("should include font family from default fonts", () => {
    const def = createFontFamilyItem({
      ref: "someRef",
      themeAccessor,
      translator,
      flags,
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
        styles: { fontFamily: "Test families" },
      },
      {
        value: "Test family",
        label: "Test family",
        groupHeader: false,
        disabled: false,
        styles: { fontFamily: "Test family" },
      },
      {
        value: "Theme family",
        label: "Theme family",
        groupHeader: false,
        disabled: false,
        styles: { fontFamily: "Theme family" },
      },
      {
        value: "DefaultHeader",
        label: "properties.allFonts",
        metaText: "properties.default",
        groupHeader: true,
      },
      {
        value: defaultSharedFont,
        label: defaultSharedFont,
        groupHeader: false,
        disabled: false,
        styles: { fontFamily: defaultSharedFont },
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
      flags,
    });

    expect(def.defaultValue(null, null, args)).toEqual(fontFamily);
    expect(def.options(null, null, args).filter((f) => f.value === fontFamily)).toEqual([
      {
        value: fontFamily,
        label: fontFamily,
        groupHeader: false,
        disabled: false,
        styles: {
          fontFamily,
        },
      },
    ]);
  });

  test("should remove duplicated font families from Default section", () => {
    fontFamilies = [DEFAULT_FONT_FAMILY];

    const def = createFontFamilyItem({
      ref: "someRef",
      themeAccessor,
      translator,
      flags,
    });

    expect(def.options(null, null, args).filter((f) => f.value === DEFAULT_FONT_FAMILY)).toEqual([
      {
        value: DEFAULT_FONT_FAMILY,
        label: DEFAULT_FONT_FAMILY,
        groupHeader: false,
        disabled: false,
        styles: {
          fontFamily: "Source Sans Pro, sans-serif",
        },
      },
    ]);
  });

  test("should remove Default section if there are no unique font families", () => {
    fontFamilies = qlikChartModules.getAvailableFonts(flags);

    const def = createFontFamilyItem({
      ref: "someRef",
      themeAccessor,
      translator,
      flags,
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
      flags,
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
        styles: { fontFamily },
      },
      {
        value: themeAccessorFontFamily,
        label: themeAccessorFontFamily,
        groupHeader: false,
        disabled: false,
        styles: { fontFamily: themeAccessorFontFamily },
      },
    ]);
  });
});
