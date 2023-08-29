import type { HeaderTitle } from "../../../types/types";
import extractHeaders from "../extract-headers";
import createHeadersData from "../headers-data";

jest.mock("../extract-headers");
const mockedExtractHeaders = extractHeaders as jest.MockedFunction<typeof extractHeaders>;

describe("create headers data", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("should return correct headers data", () => {
    const headers = [
      [
        { id: "a", title: "a" },
        { id: "b", title: "b" },
      ],
    ];
    mockedExtractHeaders.mockReturnValue(headers);

    const headersData = createHeadersData(1, []);

    expect(headersData.data).toEqual(headers);
    expect(headersData.size.x).toBe(1);
    expect(headersData.size.y).toBe(2);
  });

  test("should handle when there are no headers", () => {
    const headers = [] as HeaderTitle[][];
    mockedExtractHeaders.mockReturnValue(headers);

    const headersData = createHeadersData(1, []);

    expect(headersData.data).toEqual(headers);
    expect(headersData.size.x).toBe(0);
    expect(headersData.size.y).toBe(0);
  });
});
