import type { Header, VisibleDimensionInfo } from "../../../types/types";
import extractHeaders from "../extract-headers";
import createHeadersData from "../headers-data";

jest.mock("../extract-headers");
const mockedExtractHeaders = extractHeaders as jest.MockedFunction<typeof extractHeaders>;

describe("create headers data", () => {
  const dimension = {} as VisibleDimensionInfo;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("should return correct headers data", () => {
    const headers: Header[][] = [
      [
        { id: "a", title: "a", type: "left", approximateMaxGlyphCount: 1, includeMeasures: false },
        { id: "b", title: "b", type: "left", approximateMaxGlyphCount: 1, includeMeasures: false },
      ],
    ];
    mockedExtractHeaders.mockReturnValue(headers);

    const headersData = createHeadersData([dimension], [dimension, dimension]);

    expect(headersData.data).toEqual(headers);
    expect(headersData.size.rows).toBe(1);
    expect(headersData.size.cols).toBe(2);
  });

  test("should handle when there are no headers", () => {
    const headers = [] as Header[][];
    mockedExtractHeaders.mockReturnValue(headers);

    const headersData = createHeadersData([dimension], [dimension, dimension]);

    expect(headersData.data).toEqual(headers);
    expect(headersData.size.rows).toBe(0);
    expect(headersData.size.cols).toBe(0);
  });
});
