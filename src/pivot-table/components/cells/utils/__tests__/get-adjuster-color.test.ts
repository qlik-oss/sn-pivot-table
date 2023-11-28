import type { StyleService } from "../../../../../types/types";
import { Colors } from "../../../shared-styles";
import getAdjusterColor from "../get-adjuster-color";

describe("get-adjuster-color", () => {
  let styleService: StyleService;
  let isHeader: boolean;

  beforeEach(() => {
    styleService = {
      header: {
        background: Colors.Transparent,
      },
      dimensionValues: {
        background: Colors.Transparent,
      },
      grid: {
        border: Colors.Black15,
      },
    } as StyleService;
    isHeader = true;
  });

  test("should return blended color for header with default styling", () => {
    const color = getAdjusterColor(styleService, isHeader);
    expect(color).toBe("rgb(216.75, 216.75, 216.75)");
  });

  test("should return blended color for top grid with default styling", () => {
    isHeader = false;

    const color = getAdjusterColor(styleService, isHeader);
    expect(color).toBe("rgb(216.75, 216.75, 216.75)");
  });

  test("should return blended adjuster color for non-transparent background", () => {
    styleService.header.background = "#ff0000";

    const color = getAdjusterColor(styleService, isHeader);
    expect(color).toBe("rgb(216.75, 0, 0)");
  });

  test("should return blended adjuster color for specified translucent border and opaque background", () => {
    styleService.header.background = "#ff0000";
    styleService.grid.border = "rgba(0, 0, 0, 0.5)";

    const color = getAdjusterColor(styleService, isHeader);
    expect(color).toBe("rgb(127.5, 0, 0)");
  });

  test("should return unchanged adjuster color for opaque border color", () => {
    styleService.grid.border = "#ff0000";

    const color = getAdjusterColor(styleService, isHeader);
    expect(color).toBe(styleService.grid.border);
  });
});
