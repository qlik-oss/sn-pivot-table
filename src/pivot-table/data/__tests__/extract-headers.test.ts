import { PSEUDO_DIMENSION_INDEX } from "../../../constants";
import type { VisibleDimensionInfo } from "../../../types/types";
import { createDims } from "../../__tests__/test-helper";
import extractHeaders from "../extract-headers";

describe("extractHeaders", () => {
  test("should extract headers with dim left count 0 and dim top count 0", () => {
    const visibleTopDimensions: VisibleDimensionInfo[] = [];
    const visibleLeftDimensions: VisibleDimensionInfo[] = [];
    const headers = extractHeaders(visibleTopDimensions, visibleLeftDimensions);

    expect(headers).toHaveLength(1);
    expect(headers[0]).toHaveLength(1);
    expect(headers[0][0]).toBe(null);
  });

  test("should extract headers with dim left count 1 and dim top count 1", () => {
    const visibleTopDimensions = createDims(1);
    const visibleLeftDimensions = createDims(0);
    const headers = extractHeaders(visibleTopDimensions, visibleLeftDimensions);

    expect(headers).toHaveLength(1);
    expect(headers[0]).toHaveLength(2);
    expect(headers[0][0]?.title).toBe("dim 0");
    expect(headers[0][0]?.id).toBe("id-0");
    expect(headers[0][1]?.title).toBe("dim 1");
    expect(headers[0][1]?.id).toBe("id-1");
  });

  test("should extract headers with dim left count 1 and dim top count 2", () => {
    const visibleTopDimensions = createDims(1, 2);
    const visibleLeftDimensions = createDims(0);
    const headers = extractHeaders(visibleTopDimensions, visibleLeftDimensions);

    expect(headers).toHaveLength(2);
    expect(headers[0]).toHaveLength(2);
    expect(headers[1]).toHaveLength(2);
    expect(headers[0][0]).toBe(null);
    expect(headers[0][1]?.title).toBe("dim 1");
    expect(headers[0][1]?.id).toBe("id-1");
    expect(headers[1][0]?.title).toBe("dim 0");
    expect(headers[1][0]?.id).toBe("id-0");
    expect(headers[1][1]?.title).toBe("dim 2");
    expect(headers[1][1]?.id).toBe("id-2");
  });

  test("should extract headers with dim left count 2 and dim top count 1", () => {
    const visibleTopDimensions = createDims(2);
    const visibleLeftDimensions = createDims(0, 1);
    const headers = extractHeaders(visibleTopDimensions, visibleLeftDimensions);

    expect(headers).toHaveLength(1);
    expect(headers[0]).toHaveLength(3);
    expect(headers[0][0]?.title).toBe("dim 0");
    expect(headers[0][0]?.id).toBe("id-0");
    expect(headers[0][1]?.title).toBe("dim 1");
    expect(headers[0][1]?.id).toBe("id-1");
    expect(headers[0][2]?.title).toBe("dim 2");
    expect(headers[0][2]?.id).toBe("id-2");
  });

  test("should extract headers with dim left count 2 and dim top count 1 and a pseudo dimension on first left dim", () => {
    const visibleLeftDimensions = createDims(PSEUDO_DIMENSION_INDEX, 0);
    const visibleTopDimensions = createDims(1);
    const headers = extractHeaders(visibleTopDimensions, visibleLeftDimensions);

    expect(headers).toHaveLength(1);
    expect(headers[0]).toHaveLength(3);
    expect(headers[0][0]?.title).toBe("");
    expect(headers[0][0]?.id).toBe(-1);
    expect(headers[0][1]?.title).toBe("dim 0");
    expect(headers[0][1]?.id).toBe("id-0");
    expect(headers[0][2]?.title).toBe("dim 1");
    expect(headers[0][2]?.id).toBe("id-1");
  });

  test("should extract headers with dim left count 2 and dim top count 1 and a pseudo dimension on last left dim", () => {
    const visibleTopDimensions = createDims(1);
    const visibleLeftDimensions = createDims(0, PSEUDO_DIMENSION_INDEX);
    const headers = extractHeaders(visibleTopDimensions, visibleLeftDimensions);

    expect(headers).toHaveLength(1);
    expect(headers[0]).toHaveLength(2);
    expect(headers[0][0]?.title).toBe("dim 0");
    expect(headers[0][0]?.id).toBe("id-0");
    expect(headers[0][1]?.title).toBe("dim 1");
    expect(headers[0][1]?.id).toBe("id-1");
  });

  test("should extract headers with dim left count 2 and dim top count 2", () => {
    const visibleTopDimensions = createDims(2, 3);
    const visibleLeftDimensions = createDims(0, 1);
    const headers = extractHeaders(visibleTopDimensions, visibleLeftDimensions);

    expect(headers).toHaveLength(2);
    expect(headers[0]).toHaveLength(3);
    expect(headers[1]).toHaveLength(3);
    expect(headers[0][0]).toBe(null);
    expect(headers[0][1]).toBe(null);
    expect(headers[0][2]?.title).toBe("dim 2");
    expect(headers[0][2]?.id).toBe("id-2");
    expect(headers[1][0]?.title).toBe("dim 0");
    expect(headers[1][0]?.id).toBe("id-0");
    expect(headers[1][1]?.title).toBe("dim 1");
    expect(headers[1][1]?.id).toBe("id-1");
    expect(headers[1][2]?.title).toBe("dim 3");
    expect(headers[1][2]?.id).toBe("id-3");
  });

  test("should extract headers with dim left count 2 and dim top count 2 and pseudo dimension on last top", () => {
    const visibleTopDimensions = createDims(2, PSEUDO_DIMENSION_INDEX);
    const visibleLeftDimensions = createDims(0, 1);
    const headers = extractHeaders(visibleTopDimensions, visibleLeftDimensions);

    expect(headers).toHaveLength(2);
    expect(headers[0]).toHaveLength(2);
    expect(headers[1]).toHaveLength(2);
    expect(headers[0][0]).toBe(null);
    expect(headers[0][1]?.title).toBe("dim 2");
    expect(headers[0][1]?.id).toBe("id-2");
    expect(headers[1][0]?.title).toBe("dim 0");
    expect(headers[1][0]?.id).toBe("id-0");
    expect(headers[1][1]?.title).toBe("dim 1");
    expect(headers[1][1]?.id).toBe("id-1");
  });

  test("should extract headers with dim left count 1 and dim top count 2 and pseudo dimension on first top", () => {
    const visibleLeftDimensions = createDims(0);
    const visibleTopDimensions = createDims(PSEUDO_DIMENSION_INDEX, 1);
    const headers = extractHeaders(visibleTopDimensions, visibleLeftDimensions);

    expect(headers).toHaveLength(3);
    expect(headers[0]).toHaveLength(1);
    expect(headers[1]).toHaveLength(1);
    expect(headers[2]).toHaveLength(1);
    expect(headers[0][0]?.title).toBe("");
    expect(headers[0][0]?.id).toBe(-1);
    expect(headers[1][0]?.title).toBe("dim 1");
    expect(headers[1][0]?.id).toBe("id-1");
    expect(headers[2][0]?.title).toBe("dim 0");
    expect(headers[2][0]?.id).toBe("id-0");
  });

  test("should extract headers with dim left count 2 and dim top count 2 and pseudo dimension on first top", () => {
    const visibleTopDimensions = createDims(PSEUDO_DIMENSION_INDEX, 2);
    const visibleLeftDimensions = createDims(0, 1);
    const headers = extractHeaders(visibleTopDimensions, visibleLeftDimensions);

    expect(headers).toHaveLength(3);
    expect(headers[0]).toHaveLength(2);
    expect(headers[1]).toHaveLength(2);
    expect(headers[2]).toHaveLength(2);
    expect(headers[0][0]).toBe(null);
    expect(headers[0][1]?.title).toBe("");
    expect(headers[0][1]?.id).toBe(-1);
    expect(headers[1][0]).toBe(null);
    expect(headers[1][1]?.title).toBe("dim 2");
    expect(headers[1][1]?.id).toBe("id-2");
    expect(headers[2][0]?.title).toBe("dim 0");
    expect(headers[2][0]?.id).toBe("id-0");
    expect(headers[2][1]?.title).toBe("dim 1");
    expect(headers[2][1]?.id).toBe("id-1");
  });

  test("should extract headers with dim left count 2 and dim top count 2 and pseudo dimension on last left", () => {
    const visibleTopDimensions = createDims(1, 2);
    const visibleLeftDimensions = createDims(0, PSEUDO_DIMENSION_INDEX);
    const headers = extractHeaders(visibleTopDimensions, visibleLeftDimensions);

    expect(headers).toHaveLength(2);
    expect(headers[0]).toHaveLength(2);
    expect(headers[1]).toHaveLength(2);
    expect(headers[0][0]).toBe(null);
    expect(headers[0][1]?.title).toBe("dim 1");
    expect(headers[0][1]?.id).toBe("id-1");
    expect(headers[1][0]?.title).toBe("dim 0");
    expect(headers[1][0]?.id).toBe("id-0");
    expect(headers[1][1]?.title).toBe("dim 2");
    expect(headers[1][1]?.id).toBe("id-2");
  });

  test("should extract headers with dim left count 2 and dim top count 2 and pseudo dimension on first left", () => {
    const visibleTopDimensions = createDims(1, 2);
    const visibleLeftDimensions = createDims(PSEUDO_DIMENSION_INDEX, 0);
    const headers = extractHeaders(visibleTopDimensions, visibleLeftDimensions);

    expect(headers).toHaveLength(2);
    expect(headers[0]).toHaveLength(3);
    expect(headers[1]).toHaveLength(3);
    expect(headers[0][0]).toBe(null);
    expect(headers[0][1]).toBe(null);
    expect(headers[0][2]?.title).toBe("dim 1");
    expect(headers[0][2]?.id).toBe("id-1");
    expect(headers[1][0]?.title).toBe("");
    expect(headers[1][0]?.id).toBe(-1);
    expect(headers[1][1]?.title).toBe("dim 0");
    expect(headers[1][1]?.id).toBe("id-0");
    expect(headers[1][2]?.title).toBe("dim 2");
    expect(headers[1][2]?.id).toBe("id-2");
  });
});
