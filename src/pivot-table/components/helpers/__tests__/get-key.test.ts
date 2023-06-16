import { PSEUDO_DIMENSION_INDEX } from "../../../../constants";
import type { VisibleDimensionInfo } from "../../../../types/types";
import getKey from "../get-key";

describe("get-key", () => {
  test("should return -1 for pseudo key", () => {
    const key = getKey(PSEUDO_DIMENSION_INDEX);
    expect(key).toBe(-1);
  });

  test("should return id 1 for dimension using qLibraryId", () => {
    const dim = { qLibraryId: "1" } as unknown as VisibleDimensionInfo;
    const key = getKey(dim);
    expect(key).toBe("1");
  });

  test("should return id 1 for dimension using cId", () => {
    const dim = { cId: "1" } as unknown as VisibleDimensionInfo;
    const key = getKey(dim);
    expect(key).toBe("1");
  });

  test("should return id 123 for dimension using qGroupFallbackTitles", () => {
    const dim = { qGroupFallbackTitles: ["1", "2", "3"] } as unknown as VisibleDimensionInfo;
    const key = getKey(dim);
    expect(key).toBe("123");
  });

  test("should return id fallbackTitle for dimension using qFallbackTitle", () => {
    const dim = { qFallbackTitle: "fallbackTitle" } as unknown as VisibleDimensionInfo;
    const key = getKey(dim);
    expect(key).toBe("fallbackTitle");
  });
});
