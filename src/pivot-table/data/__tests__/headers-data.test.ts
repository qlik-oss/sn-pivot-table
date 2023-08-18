import type { HyperCube } from "../../../types/QIX";
import type { HeaderTitle } from "../../../types/types";
import extractHeaders from "../extract-headers";
import createHeadersData from "../headers-data";

jest.mock("../extract-headers");
const mockedExtractHeaders = extractHeaders as jest.MockedFunction<typeof extractHeaders>;

describe("create headers data", () => {
  let hyperCube: HyperCube;

  beforeEach(() => {
    jest.resetAllMocks();
    hyperCube = {
      activelySortedColumn: { colIdx: 0 },
    } as HyperCube;
  });

  test("should return correct headers data", () => {
    const headers = [
      [
        { id: "a", title: "a" },
        { id: "b", title: "b" },
      ] as HeaderTitle[],
    ];
    mockedExtractHeaders.mockReturnValue(headers);

    const headersData = createHeadersData(hyperCube, 1, []);

    expect(headersData.data).toEqual(headers);
    expect(headersData.size.x).toBe(1);
    expect(headersData.size.y).toBe(2);
  });

  test("should handle when there are no headers", () => {
    const headers = [] as HeaderTitle[][];
    mockedExtractHeaders.mockReturnValue(headers);

    const headersData = createHeadersData(hyperCube, 1, []);

    expect(headersData.data).toEqual(headers);
    expect(headersData.size.x).toBe(0);
    expect(headersData.size.y).toBe(0);
  });
});
