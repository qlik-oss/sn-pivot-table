import type { HeaderCell, LayoutService, VisibleDimensionInfo } from "../../../types/types";
import extractHeaders from "../extract-headers";
import createHeadersData from "../headers-data";

jest.mock("../extract-headers");
const mockedExtractHeaders = extractHeaders as jest.MockedFunction<typeof extractHeaders>;

describe("create headers data", () => {
  let layoutService: LayoutService;

  beforeEach(() => {
    jest.resetAllMocks();
    layoutService = {
      layout: {
        qHyperCube: {
          activelySortedColumn: { colIdx: 0 },
        },
      },
      getDimensionInfoIndex: (info: VisibleDimensionInfo) => (info === -1 ? -1 : 0),
    } as LayoutService;
  });

  test("should return correct headers data", () => {
    const headers = [
      [
        { id: "a", label: "a" },
        { id: "b", label: "b" },
      ] as HeaderCell[],
    ];
    mockedExtractHeaders.mockReturnValue(headers);

    const headersData = createHeadersData(layoutService, [], []);

    expect(headersData.data).toEqual(headers);
    expect(headersData.size.x).toBe(2);
    expect(headersData.size.y).toBe(1);
  });

  test("should handle when there are no headers", () => {
    const headers = [] as HeaderCell[][];
    mockedExtractHeaders.mockReturnValue(headers);

    const headersData = createHeadersData(layoutService, [], []);

    expect(headersData.data).toEqual(headers);
    expect(headersData.size.x).toBe(0);
    expect(headersData.size.y).toBe(0);
  });
});
