import type { stardust } from "@nebula.js/stardust";
import { ColumnWidthValues } from "@qlik/nebula-table-utils/lib/constants";
import { DEFAULT_CELL_HEIGHT } from "../pivot-table/constants";

const MAX_ENGINE_PAGE_SIZE = 10_000;
const MAX_ENGINE_PAGE_SIZE_SIDE = Math.sqrt(MAX_ENGINE_PAGE_SIZE);

export const getMaxVisibleRowsAndColumns = (rect: stardust.Rect) => {
  const maxNumberOfVisibleRows = Math.ceil(rect.height / DEFAULT_CELL_HEIGHT);
  const maxNumberOfVisibleColumns = Math.ceil(rect.width / ColumnWidthValues.PixelsMin);

  return {
    maxNumberOfVisibleRows,
    maxNumberOfVisibleColumns,
  };
};

/**
 * When quering Engine for data, it can at most return 10 000 data values per page.
 * This helper function take a large page and splits it into multiple smaller pages
 * that are all <= 10 000.
 */
const handleMaxEnginePageSize = (page: EngineAPI.INxPage | null) => {
  if (page === null) {
    return [];
  }

  if (page.qWidth * page.qHeight < MAX_ENGINE_PAGE_SIZE) {
    return [page];
  }

  const pages: EngineAPI.INxPage[] = [];
  const columnCount = Math.ceil(page.qWidth / MAX_ENGINE_PAGE_SIZE_SIDE);
  const rowCount = Math.ceil(page.qHeight / MAX_ENGINE_PAGE_SIZE_SIDE);

  for (let colIndex = 0; colIndex < columnCount; colIndex++) {
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      pages.push({
        qLeft: page.qLeft + colIndex * MAX_ENGINE_PAGE_SIZE_SIDE,
        qTop: page.qTop + rowIndex * MAX_ENGINE_PAGE_SIZE_SIDE,
        qWidth: Math.min(MAX_ENGINE_PAGE_SIZE_SIDE, page.qWidth - colIndex * MAX_ENGINE_PAGE_SIZE_SIDE),
        qHeight: Math.min(MAX_ENGINE_PAGE_SIZE_SIDE, page.qHeight - rowIndex * MAX_ENGINE_PAGE_SIZE_SIDE),
      });
    }
  }

  return pages;
};

export default handleMaxEnginePageSize;
