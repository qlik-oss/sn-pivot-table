import { PSEUDO_DIMENSION_INDEX } from "../../../constants";
import type { ExtendedHyperCube } from "../../../types/QIX";
import extractHeaders from "../extract-headers";
import { createDimInfo } from "./test-helper";

describe("extractHeaders", () => {
  let hyperCube: ExtendedHyperCube;

  beforeEach(() => {
    hyperCube = {
      activelySortedColumn: { colIdx: 0 },
    } as ExtendedHyperCube;
  });

  test("should extract headers with row count 1 and column count 1", () => {
    const sortedLeftDimensionInfo = createDimInfo(1);
    const sortedTopDimensionInfo = createDimInfo(1);
    const headers = extractHeaders(hyperCube, sortedTopDimensionInfo, sortedLeftDimensionInfo);

    expect(headers).toHaveLength(1);
    expect(headers[0]).toHaveLength(1);
    expect(headers[0][0]?.title).toBe("dim 0");
    expect(headers[0][0]?.id).toBe("id-0");
  });

  test("should extract headers with row count 1 and column count 2", () => {
    const sortedLeftDimensionInfo = createDimInfo(2);
    const sortedTopDimensionInfo = createDimInfo(1);
    const headers = extractHeaders(hyperCube, sortedTopDimensionInfo, sortedLeftDimensionInfo);

    expect(headers).toHaveLength(2);
    expect(headers[0]).toHaveLength(1);
    expect(headers[0][0]?.title).toBe("dim 0");
    expect(headers[0][0]?.id).toBe("id-0");
    expect(headers[1][0]?.title).toBe("dim 1");
    expect(headers[1][0]?.id).toBe("id-1");
  });

  test("should extract headers with row count 1 and column count 2 and a pseudo dimension on first column", () => {
    const sortedLeftDimensionInfo = createDimInfo(1);
    const sortedTopDimensionInfo = createDimInfo(1);
    sortedLeftDimensionInfo.unshift(PSEUDO_DIMENSION_INDEX);
    const headers = extractHeaders(hyperCube, sortedTopDimensionInfo, sortedLeftDimensionInfo);

    expect(headers).toHaveLength(2);
    expect(headers[0]).toHaveLength(1);
    expect(headers[0][0]?.title).toBe("");
    expect(headers[0][0]?.id).toBe("PSEUDO-DIM");
    expect(headers[1][0]?.title).toBe("dim 0");
    expect(headers[1][0]?.id).toBe("id-0");
  });

  test("should extract headers with row count 1 and column count 2 and a pseudo dimension on last column", () => {
    const sortedLeftDimensionInfo = createDimInfo(1);
    const sortedTopDimensionInfo = createDimInfo(1);
    sortedLeftDimensionInfo.push(PSEUDO_DIMENSION_INDEX);
    const headers = extractHeaders(hyperCube, sortedTopDimensionInfo, sortedLeftDimensionInfo);

    expect(headers).toHaveLength(2);
    expect(headers[0]).toHaveLength(1);
    expect(headers[0][0]?.title).toBe("dim 0");
    expect(headers[0][0]?.id).toBe("id-0");
    expect(headers[1][0]?.title).toBe("");
    expect(headers[1][0]?.id).toBe("PSEUDO-DIM");
  });

  test("should extract headers with row count 2 and column count 1", () => {
    const sortedLeftDimensionInfo = createDimInfo(1);
    const sortedTopDimensionInfo = createDimInfo(2);
    const headers = extractHeaders(hyperCube, sortedTopDimensionInfo, sortedLeftDimensionInfo);

    expect(headers).toHaveLength(1);
    expect(headers[0]).toHaveLength(2);
    expect(headers[0][0]).toBe(null);
    expect(headers[0][1]?.title).toBe("dim 0");
    expect(headers[0][1]?.id).toBe("id-0");
  });

  test("should extract headers with row count 2 and column count 2", () => {
    const sortedLeftDimensionInfo = createDimInfo(2);
    const sortedTopDimensionInfo = createDimInfo(2);
    const headers = extractHeaders(hyperCube, sortedTopDimensionInfo, sortedLeftDimensionInfo);

    expect(headers).toHaveLength(2);
    expect(headers[0]).toHaveLength(2);
    expect(headers[0][0]).toBe(null);
    expect(headers[1][0]).toBe(null);
    expect(headers[0][1]?.title).toBe("dim 0");
    expect(headers[0][1]?.id).toBe("id-0");
    expect(headers[1][1]?.title).toBe("dim 1");
    expect(headers[1][1]?.id).toBe("id-1");
  });
});
