import type { ExtendedMeasureInfo, TextAlign } from "../../../../../types/QIX";
import type { Flags } from "../../../../../types/types";
import { getJustifyContent } from "../get-measure-cell-style";
import resolveTextAlign from "../resolve-text-align";

jest.mock("../resolve-text-align");

describe("getJustifyContent", () => {
  const mockedResolveTextAlign = resolveTextAlign as jest.MockedFunction<typeof resolveTextAlign>;
  const flags = {} as Flags;
  const textAlign: TextAlign = {
    auto: true,
    align: "left",
  };
  const measureInfo = { textAlign } as ExtendedMeasureInfo;

  beforeEach(() => {
    mockedResolveTextAlign.mockReturnValue("");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("should call resolve text align with default value for numeric values", () => {
    getJustifyContent(measureInfo, true, flags);

    expect(mockedResolveTextAlign).toHaveBeenCalledWith(textAlign, "flex-end", flags);
  });

  test("should call resolve text align with default value for non-numeric values", () => {
    getJustifyContent(measureInfo, false, flags);

    expect(mockedResolveTextAlign).toHaveBeenCalledWith(textAlign, "center", flags);
  });
});
