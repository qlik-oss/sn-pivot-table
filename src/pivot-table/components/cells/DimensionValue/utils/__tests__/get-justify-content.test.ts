import type { TextAlign } from "../../../../../../types/QIX";
import type { Cell, Flags, LayoutService } from "../../../../../../types/types";
import resolveTextAlign from "../../../utils/resolve-text-align";
import getJustifyContent from "../get-justify-content";

jest.mock("../../../utils/resolve-text-align");

describe("getJustifyContent", () => {
  const mockedResolveTextAlign = resolveTextAlign as jest.MockedFunction<typeof resolveTextAlign>;
  const flags = {} as Flags;
  const textAlign: TextAlign = {
    auto: true,
    align: "left",
  };
  const labelTextAlign: TextAlign = {
    auto: true,
    align: "left",
  };
  const layoutService = {
    getDimensionInfo: () => ({ textAlign }),
    visibleMeasureInfo: [{ labelTextAlign }],
  } as unknown as LayoutService;
  let cell: Cell;

  beforeEach(() => {
    mockedResolveTextAlign.mockReturnValue("");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("dimension cell", () => {
    beforeEach(() => {
      cell = { isPseudoDimension: false } as Cell;
    });

    test("should call resolve text align with default value for left grid", () => {
      getJustifyContent(cell, layoutService, true, flags);

      expect(mockedResolveTextAlign).toHaveBeenCalledWith(textAlign, "flex-start", flags);
    });

    test("should call resolve text align with default value for top grid", () => {
      getJustifyContent(cell, layoutService, false, flags);

      expect(mockedResolveTextAlign).toHaveBeenCalledWith(textAlign, "center", flags);
    });
  });

  describe("pseudo dimension cell", () => {
    beforeEach(() => {
      cell = { isPseudoDimension: true } as Cell;
    });

    test("should call resolve text align with default value for left grid", () => {
      getJustifyContent(cell, layoutService, true, flags);

      expect(mockedResolveTextAlign).toHaveBeenCalledWith(labelTextAlign, "flex-start", flags);
    });

    test("should call resolve text align with default value for top grid", () => {
      getJustifyContent(cell, layoutService, false, flags);

      expect(mockedResolveTextAlign).toHaveBeenCalledWith(labelTextAlign, "center", flags);
    });
  });
});
