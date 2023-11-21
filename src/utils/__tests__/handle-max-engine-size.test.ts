import type { stardust } from "@nebula.js/stardust";
import handleMaxEnginePageSize, { getMaxVisibleRowsAndColumns } from "../handle-max-engine-size";

const resolutions = {
  "8k": {
    width: 4320,
    height: 7680,
  },
  "4k": {
    width: 3840,
    height: 2160,
  },
  "1440p": {
    width: 2560,
    height: 1440,
  },
};

describe("handleMaxEnginePageSize", () => {
  test("should null page", () => {
    expect(handleMaxEnginePageSize(null)).toEqual([]);
  });

  test("should handle 1440p resolution", () => {
    const { maxNumberOfVisibleRows, maxNumberOfVisibleColumns } = getMaxVisibleRowsAndColumns(
      resolutions["1440p"] as stardust.Rect,
    );

    expect(
      handleMaxEnginePageSize({
        qLeft: 1,
        qTop: 2,
        qWidth: maxNumberOfVisibleColumns,
        qHeight: maxNumberOfVisibleRows,
      }),
    ).toEqual([{ qLeft: 1, qTop: 2, qWidth: maxNumberOfVisibleColumns, qHeight: maxNumberOfVisibleRows }]);
  });

  test("should handle 4k resolution", () => {
    const { maxNumberOfVisibleRows, maxNumberOfVisibleColumns } = getMaxVisibleRowsAndColumns(
      resolutions["4k"] as stardust.Rect,
    );

    expect(
      handleMaxEnginePageSize({
        qLeft: 1,
        qTop: 2,
        qWidth: maxNumberOfVisibleColumns,
        qHeight: maxNumberOfVisibleRows,
      }),
    ).toEqual([
      { qLeft: 1, qTop: 2, qWidth: 100, qHeight: 90 },
      { qLeft: 101, qTop: 2, qWidth: 28, qHeight: 90 },
    ]);
  });

  test("should handle 8k resolution", () => {
    const { maxNumberOfVisibleRows, maxNumberOfVisibleColumns } = getMaxVisibleRowsAndColumns(
      resolutions["8k"] as stardust.Rect,
    );

    expect(
      handleMaxEnginePageSize({
        qLeft: 1,
        qTop: 2,
        qWidth: maxNumberOfVisibleColumns,
        qHeight: maxNumberOfVisibleRows,
      }),
    ).toEqual([
      { qLeft: 1, qTop: 2, qWidth: 100, qHeight: 100 },
      { qLeft: 1, qTop: 102, qWidth: 100, qHeight: 100 },
      { qLeft: 1, qTop: 202, qWidth: 100, qHeight: 100 },
      { qLeft: 1, qTop: 302, qWidth: 100, qHeight: 20 },
      { qLeft: 101, qTop: 2, qWidth: 44, qHeight: 100 },
      { qLeft: 101, qTop: 102, qWidth: 44, qHeight: 100 },
      { qLeft: 101, qTop: 202, qWidth: 44, qHeight: 100 },
      { qLeft: 101, qTop: 302, qWidth: 44, qHeight: 20 },
    ]);
  });
});
