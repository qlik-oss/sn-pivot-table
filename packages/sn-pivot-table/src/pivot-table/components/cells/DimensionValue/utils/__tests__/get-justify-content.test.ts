import type { TextAlign } from "../../../../../../types/QIX";
import type { Cell, Flags, LayoutService } from "../../../../../../types/types";
import resolveTextAlign from "../../../utils/resolve-text-align";
import getJustifyContent from "../get-justify-content";

jest.mock("../../../utils/resolve-text-align");

describe("getJustifyContent", () => {
  const mockedResolveTextAlign = resolveTextAlign as jest.MockedFunction<typeof resolveTextAlign>;
  const flags = {} as Flags;
  const cell = {} as Cell;
  const textAlign: TextAlign = {
    auto: true,
    align: "left",
  };
  const layoutService = {
    getDimensionInfo: () => ({ textAlign }),
  } as unknown as LayoutService;

  beforeEach(() => {
    mockedResolveTextAlign.mockReturnValue("");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("should call resolve text align with default value for left grid", () => {
    getJustifyContent(cell, layoutService, true, flags);

    expect(mockedResolveTextAlign).toHaveBeenCalledWith(textAlign, undefined, flags);
  });

  test("should call resolve text align with default value for top grid", () => {
    getJustifyContent(cell, layoutService, false, flags);

    expect(mockedResolveTextAlign).toHaveBeenCalledWith(textAlign, "center", flags);
  });
});
