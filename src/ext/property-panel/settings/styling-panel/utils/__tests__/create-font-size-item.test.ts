import type { stardust } from "@nebula.js/stardust";
import { DEFAULT_FONT_SIZE } from "../../../../../../pivot-table/constants";
import type { Args, CurrentTheme } from "../../../../../../types/QIX";
import createFontSizetem, { DEFAULT_FONT_SIZES, type ThemeAccessor } from "../create-font-size-item";

describe("createFontSizetem", () => {
  const translator = { get: (str: string) => str } as stardust.Translator;
  let args: Args;
  let themeAccessor: ThemeAccessor;
  const fontSize = "1px";
  const themeAccessorFontSize = "2px";
  let fontSizes: string[] | undefined = ["3px"];

  beforeEach(() => {
    themeAccessor = () => themeAccessorFontSize;
    args = {
      theme: {
        current: () =>
          ({
            fontSize,
            fontSizes,
          } as CurrentTheme),
      },
    };
  });

  test("should include font size from default font sizes", () => {
    const def = createFontSizetem({
      ref: "someRef",
      themeAccessor,
      translator,
    });

    expect(def.ref).toEqual("someRef");
    expect(def.defaultValue(null, null, args)).toEqual(themeAccessorFontSize);
    expect(def.options(null, null, args)).toEqual([
      {
        value: "ThemeHeader",
        label: "properties.themeFontSizes",
        metaText: "properties.theme",
        groupHeader: true,
      },
      { value: "1px", label: "1px", groupHeader: false, disabled: false },
      { value: "2px", label: "2px", groupHeader: false, disabled: false },
      { value: "3px", label: "3px", groupHeader: false, disabled: false },
      {
        value: "DefaultHeader",
        label: "properties.allFontSizes",
        metaText: "properties.default",
        groupHeader: true,
      },
      { value: "10px", label: "10px", groupHeader: false, disabled: false },
      { value: "11px", label: "11px", groupHeader: false, disabled: false },
      { value: "12px", label: "12px", groupHeader: false, disabled: false },
      { value: "13px", label: "13px", groupHeader: false, disabled: false },
      { value: "14px", label: "14px", groupHeader: false, disabled: false },
      { value: "15px", label: "15px", groupHeader: false, disabled: false },
      { value: "16px", label: "16px", groupHeader: false, disabled: false },
      { value: "17px", label: "17px", groupHeader: false, disabled: false },
      { value: "18px", label: "18px", groupHeader: false, disabled: false },
      { value: "19px", label: "19px", groupHeader: false, disabled: false },
      { value: "20px", label: "20px", groupHeader: false, disabled: false },
      { value: "21px", label: "21px", groupHeader: false, disabled: false },
      { value: "22px", label: "22px", groupHeader: false, disabled: false },
      { value: "23px", label: "23px", groupHeader: false, disabled: false },
      { value: "24px", label: "24px", groupHeader: false, disabled: false },
    ]);
  });

  test("should remove duplicated font sizes from Theme section", () => {
    fontSizes = [fontSize];
    themeAccessor = () => fontSize;

    const def = createFontSizetem({
      ref: "someRef",
      themeAccessor,
      translator,
    });

    expect(def.defaultValue(null, null, args)).toEqual(fontSize);
    expect(def.options(null, null, args).filter((f) => f.value === fontSize)).toEqual([
      {
        value: fontSize,
        label: fontSize,
        groupHeader: false,
        disabled: false,
      },
    ]);
  });

  test("should remove duplicated font sizes from Default section", () => {
    fontSizes = [DEFAULT_FONT_SIZE];

    const def = createFontSizetem({
      ref: "someRef",
      themeAccessor,
      translator,
    });

    expect(def.options(null, null, args).filter((f) => f.value === DEFAULT_FONT_SIZE)).toEqual([
      {
        value: DEFAULT_FONT_SIZE,
        label: DEFAULT_FONT_SIZE,
        groupHeader: false,
        disabled: false,
      },
    ]);
  });

  test("should remove Default section if there are no unique font sizes", () => {
    fontSizes = DEFAULT_FONT_SIZES;

    const def = createFontSizetem({
      ref: "someRef",
      themeAccessor,
      translator,
    });

    const options = def.options(null, null, args);
    expect(options.filter((f) => f.value === "ThemeHeader")).toEqual([
      {
        value: "ThemeHeader",
        label: "properties.themeFontSizes",
        metaText: "properties.theme",
        groupHeader: true,
      },
    ]);
    expect(options.filter((f) => f.value === "DefaultHeader")).toEqual([]);
  });

  test("should handle when fontSizes is undefined", () => {
    fontSizes = undefined;

    const def = createFontSizetem({
      ref: "someRef",
      themeAccessor,
      translator,
    });

    expect(def.defaultValue(null, null, args)).toEqual(themeAccessorFontSize);
    expect(
      def.options(null, null, args).filter((f) => f.value === fontSize || f.value === themeAccessorFontSize)
    ).toEqual([
      {
        value: fontSize,
        label: fontSize,
        groupHeader: false,
        disabled: false,
      },
      {
        value: themeAccessorFontSize,
        label: themeAccessorFontSize,
        groupHeader: false,
        disabled: false,
      },
    ]);
  });
});
