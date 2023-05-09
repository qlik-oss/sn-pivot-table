import { PSEUDO_DIMENSION_INDEX } from "../../../constants";
import type { ExtendedDimensionInfo } from "../../../types/QIX";
import extractHeaders from "../extract-headers";

function createDimInfo(length: number): EngineAPI.INxDimensionInfo[] {
  return Array.from({ length }, (_, i: number) => `dim ${i}`).map(
    (t) => ({ qFallbackTitle: t } as EngineAPI.INxDimensionInfo)
  );
}

describe("extractHeaders", () => {
  test("should extract headers with row count 1 and column count 1", () => {
    const dimensionInfoIndex = [0];
    const headers = extractHeaders(createDimInfo(1), 1, dimensionInfoIndex);

    expect(headers).toHaveLength(1);
    expect(headers[0]).toHaveLength(1);
    expect(headers[0][0]?.title).toBe("dim 0");
    expect(headers[0][0]?.id).toBe("0-dim 0");
  });

  test("should extract headers with row count 1 and column count 2", () => {
    const dimensionInfoIndex = [0, 1];
    const nbrOfLeftDims = 2;
    const headers = extractHeaders(createDimInfo(nbrOfLeftDims), 1, dimensionInfoIndex);

    expect(headers).toHaveLength(2);
    expect(headers[0]).toHaveLength(1);
    expect(headers[0][0]?.title).toBe("dim 0");
    expect(headers[0][0]?.id).toBe("0-dim 0");
    expect(headers[1][0]?.title).toBe("dim 1");
    expect(headers[1][0]?.id).toBe("1-dim 1");
  });

  test("should extract headers with row count 1 and column count 2 and a pseudo dimension on first column", () => {
    const dimensionInfoIndex = [PSEUDO_DIMENSION_INDEX, 0];
    const nbrOfLeftDims = 2;
    const headers = extractHeaders(createDimInfo(nbrOfLeftDims), 1, dimensionInfoIndex);

    expect(headers).toHaveLength(2);
    expect(headers[0]).toHaveLength(1);
    expect(headers[0][0]?.title).toBe("");
    expect(headers[0][0]?.id).toBe("PSEUDO-DIM");
    expect(headers[1][0]?.title).toBe("dim 0");
    expect(headers[1][0]?.id).toBe("0-dim 0");
  });

  test("should extract headers with row count 1 and column count 2 and a pseudo dimension on last column", () => {
    const dimensionInfoIndex = [0, PSEUDO_DIMENSION_INDEX];
    const nbrOfLeftDims = 2;
    const headers = extractHeaders(createDimInfo(nbrOfLeftDims), 1, dimensionInfoIndex);

    expect(headers).toHaveLength(2);
    expect(headers[0]).toHaveLength(1);
    expect(headers[0][0]?.title).toBe("dim 0");
    expect(headers[0][0]?.id).toBe("0-dim 0");
    expect(headers[1][0]?.title).toBe("");
    expect(headers[1][0]?.id).toBe("PSEUDO-DIM");
  });

  test("should extract headers with row count 2 and column count 1", () => {
    const dimensionInfoIndex = [0];
    const nbrOfLeftDims = 1;
    const headers = extractHeaders(createDimInfo(nbrOfLeftDims), 2, dimensionInfoIndex);

    expect(headers).toHaveLength(1);
    expect(headers[0]).toHaveLength(2);
    expect(headers[0][0]).toBe(null);
    expect(headers[0][1]?.title).toBe("dim 0");
    expect(headers[0][1]?.id).toBe("0-dim 0");
  });

  test("should extract headers with row count 2 and column count 2", () => {
    const dimensionInfoIndex = [0, 1];
    const nbrOfLeftDims = 2;
    const headers = extractHeaders(createDimInfo(nbrOfLeftDims), 2, dimensionInfoIndex);

    expect(headers).toHaveLength(2);
    expect(headers[0]).toHaveLength(2);
    expect(headers[0][0]).toBe(null);
    expect(headers[1][0]).toBe(null);
    expect(headers[0][1]?.title).toBe("dim 0");
    expect(headers[0][1]?.id).toBe("0-dim 0");
    expect(headers[1][1]?.title).toBe("dim 1");
    expect(headers[1][1]?.id).toBe("1-dim 1");
  });

  test("should use cId as header title id when available", () => {
    const dimensionInfoIndex = [0];
    const dimInfos = createDimInfo(1);
    (dimInfos[0] as ExtendedDimensionInfo).cId = "1337";
    const headers = extractHeaders(dimInfos, 1, dimensionInfoIndex);

    expect(headers).toHaveLength(1);
    expect(headers[0]).toHaveLength(1);
    expect(headers[0][0]?.title).toBe("dim 0");
    expect(headers[0][0]?.id).toBe("1337");
  });

  test("should use qLibraryId as header title id when available", () => {
    const dimensionInfoIndex = [0];
    const dimInfos = createDimInfo(1);
    (dimInfos[0] as ExtendedDimensionInfo).qLibraryId = "1337";
    const headers = extractHeaders(dimInfos, 1, dimensionInfoIndex);

    expect(headers).toHaveLength(1);
    expect(headers[0]).toHaveLength(1);
    expect(headers[0][0]?.title).toBe("dim 0");
    expect(headers[0][0]?.id).toBe("1337");
  });
});
