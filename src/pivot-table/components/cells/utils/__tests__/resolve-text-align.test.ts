import type { Flags } from "../../../../../types/types";
import resolveTextAlign from "../resolve-text-align";

describe("resolveTextAlign", () => {
  let flags: Flags;

  beforeEach(() => {
    flags = {
      isEnabled: () => true,
    };
  });

  test("should return default value when flag is disabled", () => {
    flags.isEnabled = () => false;

    expect(resolveTextAlign({ auto: false, align: "left" }, "default", flags)).toEqual("default");
  });

  test("should return default value when text align is auto", () => {
    expect(resolveTextAlign({ auto: true, align: "left" }, "default", flags)).toEqual("default");
  });

  test("should return default value when text align is undefined", () => {
    expect(resolveTextAlign(undefined, "default", flags)).toEqual("default");
  });

  test("should return value when text align is center", () => {
    expect(resolveTextAlign({ auto: false, align: "center" }, "default", flags)).toEqual("center");
  });

  test("should return value when text align is left", () => {
    expect(resolveTextAlign({ auto: false, align: "left" }, "default", flags)).toEqual("flex-start");
  });

  test("should return value when text align is right", () => {
    expect(resolveTextAlign({ auto: false, align: "right" }, "default", flags)).toEqual("flex-end");
  });
});
