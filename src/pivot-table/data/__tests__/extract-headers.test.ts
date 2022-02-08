import { NxDimensionInfo } from "../../../types/QIX";
import extractHeaders from "../extract-headers";

function createDimInfo(length: number): NxDimensionInfo[] {
  return Array.from({ length }, (_, i: number) => `dim ${i}`).map(t => ({ qFallbackTitle: t } as NxDimensionInfo))
}

describe('extractHeaders', () => {
  test('should extract headers with row count 1 and column count 1', () => {
    const nbrOfLeftDims = 1;
    const headers = extractHeaders(createDimInfo(nbrOfLeftDims), 1, nbrOfLeftDims);

    expect(headers).toHaveLength(1);
    expect(headers[0]).toHaveLength(1);
    expect(headers[0][0]).toBe('dim 0');
  });

  test('should extract headers with row count 1 and column count 2', () => {
    const nbrOfLeftDims = 2;
    const headers = extractHeaders(createDimInfo(nbrOfLeftDims), 1, nbrOfLeftDims);

    expect(headers).toHaveLength(2);
    expect(headers[0]).toHaveLength(1);
    expect(headers[0][0]).toBe('dim 0');
    expect(headers[1][0]).toBe('dim 1');
  });

  test('should extract headers with row count 2 and column count 1', () => {
    const nbrOfLeftDims = 1;
    const headers = extractHeaders(createDimInfo(nbrOfLeftDims), 2, nbrOfLeftDims);

    expect(headers).toHaveLength(1);
    expect(headers[0]).toHaveLength(2);
    expect(headers[0][0]).toBe(null);
    expect(headers[0][1]).toBe('dim 0');
  });

  test('should extract headers with row count 2 and column count 2', () => {
    const nbrOfLeftDims = 2;
    const headers = extractHeaders(createDimInfo(nbrOfLeftDims), 2, nbrOfLeftDims);

    expect(headers).toHaveLength(2);
    expect(headers[0]).toHaveLength(2);
    expect(headers[0][0]).toBe(null);
    expect(headers[1][0]).toBe(null);
    expect(headers[0][1]).toBe('dim 0');
    expect(headers[1][1]).toBe('dim 1');
  });
});
