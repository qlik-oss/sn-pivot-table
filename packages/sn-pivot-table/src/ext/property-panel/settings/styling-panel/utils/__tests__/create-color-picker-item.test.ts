import { Colors } from "../../../../../../pivot-table/components/shared-styles";
import type { Args } from "../../../../../../types/QIX";
import createColorPickerItem from "../create-color-picker-item";

describe("createColorPickerItem", () => {
  const args = {
    theme: {
      current: () => {},
    },
  } as Args;

  test("should resolve default value from theme", () => {
    const def = createColorPickerItem("ref", "translation", () => "red");

    expect(def.defaultValue(null, null, args)).toEqual({ color: "red" });
  });

  test("should resolve default value from theme for transparent color", () => {
    const def = createColorPickerItem("ref", "translation", () => Colors.Transparent);

    expect(def.defaultValue(null, null, args)).toEqual({ color: "none" });
  });
});
