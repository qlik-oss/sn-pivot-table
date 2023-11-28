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

  test("should return default adjuster color for header", () => {
    const color = getAdjusterColor(styleService, isHeader);
    expect(color).toBe("rgb(216.75, 216.75, 216.75)");
  });
  test("should return default adjuster color for top grid", () => {
    isHeader = false;

    const color = getAdjusterColor(styleService, isHeader);
    expect(color).toBe("rgb(216.75, 216.75, 216.75)");
  });
  test("should return default adjuster color for non-transparent background", () => {
    styleService.header.background = "#ff0000";

    const color = getAdjusterColor(styleService, isHeader);
    expect(color).toBe("rgb(216.75, 0, 0)");
  });
  test("should return default adjuster color for opaque border color", () => {
    styleService.grid.border = "#00ff00";

    const color = getAdjusterColor(styleService, isHeader);
    expect(color).toBe(styleService.grid.border);
  });
});
