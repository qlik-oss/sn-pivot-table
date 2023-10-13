import type { ExtendedHyperCube } from "../../../types/QIX";
import type { HeaderCell } from "../../../types/types";
import extractHeaders from "../extract-headers";
import createHeadersData from "../headers-data";

jest.mock("../extract-headers");
const mockedExtractHeaders = extractHeaders as jest.MockedFunction<typeof extractHeaders>;

describe("create headers data", () => {
  let hyperCube: ExtendedHyperCube;

  beforeEach(() => {
    jest.resetAllMocks();
    hyperCube = {
      activelySortedColumn: { colIdx: 0 },
    } as ExtendedHyperCube;
  });

  test("should return correct headers data", () => {
    const headers = [
      [
        { id: "a", label: "a" },
        { id: "b", label: "b" },
      ] as HeaderCell[],
    ];
    mockedExtractHeaders.mockReturnValue(headers);

    const headersData = createHeadersData(hyperCube, 1, []);

    expect(headersData.data).toEqual(headers);
    expect(headersData.size.x).toBe(1);
    expect(headersData.size.y).toBe(2);
  });

  test("should handle when there are no headers", () => {
    const headers = [] as HeaderCell[][];
    mockedExtractHeaders.mockReturnValue(headers);

    const headersData = createHeadersData(hyperCube, 1, []);

    expect(headersData.data).toEqual(headers);
    expect(headersData.size.x).toBe(0);
    expect(headersData.size.y).toBe(0);
  });
});
