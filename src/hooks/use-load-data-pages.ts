import type { stardust } from "@nebula.js/stardust";
import { useFetch } from "@qlik/nebula-table-utils/lib/hooks";
import { Q_PATH } from "../constants";
import { MAX_COLUMN_COUNT } from "../pivot-table/constants";
import type { Model, PivotLayout } from "../types/QIX";
import type { LayoutService, PageInfo, ViewService } from "../types/types";
import handleMaxEnginePageSize, { getMaxVisibleRowsAndColumns } from "../utils/handle-max-engine-size";
import useMutableNebulaProp from "./use-mutable-nebula-prop";

interface Props {
  model: Model;
  layoutService: LayoutService;
  viewService: ViewService;
  pageInfo: PageInfo;
  rect: stardust.Rect;
}

export const shouldFetchExpandOrCollapseData = (
  triggerdByExpandOrCollapse: boolean,
  viewService: ViewService,
  maxNumberOfVisibleRows: number,
  maxNumberOfVisibleColumns: number,
) => {
  if (!triggerdByExpandOrCollapse) {
    return false;
  }

  return (
    viewService.gridColumnStartIndex + viewService.gridWidth >= maxNumberOfVisibleColumns ||
    viewService.gridRowStartIndex + viewService.gridHeight >= maxNumberOfVisibleRows
  );
};

export const isMissingInitialDataPages = (
  layout: PivotLayout,
  pageInfo: PageInfo,
  maxNumberOfVisibleRows: number,
  maxNumberOfVisibleColumns: number,
): boolean => {
  const {
    qHyperCube: { qPivotDataPages, qSize },
  } = layout;
  const { qTop, qWidth, qHeight } = qPivotDataPages[0]?.qArea ?? { qTop: 0, qWidth: 0, qHeight: 0 };

  // in case of new page -> return true
  if (qTop < pageInfo.page * pageInfo.rowsPerPage) return true;
  // otherwise check if we are missing data
  return (
    qWidth < Math.min(maxNumberOfVisibleColumns, qSize.qcx) || qHeight < Math.min(maxNumberOfVisibleRows, qSize.qcy)
  );
};

/**
 * Note: the state of the viewService is always from the last time the chart was rendered. So it is not
 * guaranteed to work with a new layout, as its properties may no longer be valid.
 */
export const getFetchArea = (
  triggerdByExpandOrCollapse: boolean,
  viewService: ViewService,
  qSize: EngineAPI.ISize,
  pageInfo: PageInfo,
  maxNumberOfVisibleRows: number,
  maxNumberOfVisibleColumns: number,
) => {
  const pageStartIndex = pageInfo.page * pageInfo.rowsPerPage;
  // Do not fetch data beyond this value. Either because there is no more data in the layout or the current page ends.
  const pageEndIndex = Math.min(pageStartIndex + pageInfo.rowsPerPage, qSize.qcy);
  if (qSize.qcy < pageStartIndex) {
    /**
     * Do not fetch data that does not exist. This can happen because "PageInfo" is resolved from the layout.
     * Which means it will not be updated until the next render cycle.
     */
    return null;
  }

  let qLeft = 0;
  let qTop = pageStartIndex;

  if (triggerdByExpandOrCollapse) {
    /**
     * Scenarios that can happen after a cell is expanded or collapse at a position (row or col index):
     *
     * - qLastExpandedPos[qx | qy] equals the position where the cell was expanded.
     *   - No rows or columns was added before the expanded cell.
     *   - The last row or column index that was visible to the user when the cell was expanded exists in the data.
     *   - Start indexes in ViewService are valid.
     *   - After expanding, cell will be in view.
     *
     * - qLastExpandedPos[qx | qy] is greater than the position where the cell was expanded.
     *   - Rows or columns was added before the expanded cell.
     *   - The last row or column index that was visible to the user when the cell was expanded exists in the data.
     *   - Start indexes in ViewService are valid.
     *   - After expanding, cell could be in view or not.
     *
     * - qLastExpandedPos[qx | qy] equals the position where the cell was collapsed.
     *   - No rows or columns was removed before the collapsed cell.
     *   - Rows or columns was removed after the collapsed cell.
     *   - The last row or column index that was visible to the user when the cell was collapse exists in the data.
     *   - Start indexes in ViewService are valid.
     *   - After collapsing, cell will be in view.
     *
     * - qLastExpandedPos[qx | qy] equals the position where the cell was collapsed.
     *   - No rows or columns was removed before the collapsed cell.
     *   - Rows or columns was removed after the collapsed cell.
     *   - The last row or column index that was visible to the user when the cell was collapse NO LONGER EXIST in the data.
     *   - Start indexes in ViewService are INVALID.
     *   - After collapsing, cell will be in view.
     *
     * - qLastExpandedPos[qx | qy] is less than the position where the cell was collapsed.
     *   - Rows or columns was removed before collapsed cell.
     *   - The last row or column index that was visible to the user when the cell was collapse exists in the data.
     *   - Start indexes in ViewService are valid.
     *   - After collapsing, cell could be in view or not.
     *
     * - qLastExpandedPos[qx | qy] is less than the position where the cell was collapsed.
     *   - Rows or columns was removed before collapsed cell.
     *   - The row or column index where the cell was collapsed exist in the data.
     *   - The last row or column index that was visible to the user when the cell was collapsed NO LONGER exists in the data
     *   - Start indexes in ViewService are INVALID.
     *   - After collapsing, cell will be in view.
     *
     * - qLastExpandedPos[qx | qy] is less than the position where the cell was collapsed.
     *   - Rows or columns was removed before collapsed cell.
     *   - The row or column index where the cell was collapsed NO LONGER exist in the data.
     *   - The last row or column index that was visible to the user when the cell was collapsed NO LONGER exists in the data
     *   - Start indexes in ViewService are INVALID.
     *   - After collapsing, cell will not be in view.
     *
     */

    qLeft = viewService.gridColumnStartIndex;
    qTop = pageStartIndex + viewService.gridRowStartIndex;

    const lastVisibleRow = qTop + viewService.gridHeight;
    const lastVisibleColumn = viewService.gridColumnStartIndex + viewService.gridWidth;

    if (lastVisibleRow > pageEndIndex) {
      // Last visible row no longer exists.
      qTop = Math.max(0, pageEndIndex - maxNumberOfVisibleRows);
    }

    if (lastVisibleColumn > qSize.qcx) {
      // Last visible column no longer exists.
      qLeft = Math.max(0, qSize.qcx - maxNumberOfVisibleColumns);
    }
  }

  return {
    qLeft,
    qTop,
    qWidth: Math.min(MAX_COLUMN_COUNT - qLeft, qSize.qcx - qLeft, maxNumberOfVisibleColumns),
    qHeight: Math.min(pageEndIndex - qTop, maxNumberOfVisibleRows),
  };
};

/**
 * This hook is a safeguard to ensure that there is data available to render when some user action
 * invalides the currently rendered data OR it's the first time the chart renders.
 *
 * In a lot of cases the `qInitialDataFetch` property is sufficient to cover all cells that will be rendered.
 * But sometimes not even that is enough. Some scenarios that requires additional data to be fetch:
 * - Expanding/Collapsing a cell that is not within the area of `qInitialDataFetch`.
 * - The value of `qInitialDataFetch` could be overwritten to a much smaller value
 *   then the default or have no value at all.
 * - User changes page to a page greater than 0.
 * - A high screen resolution with large pivot table can render a lot of cells, that far exceed the
 *   2500 cells that is the default number of cells. Ex: a 8k resolution could require at least
 *   ~36 000 cells to fully render.
 *
 */
const useLoadDataPages = ({ model, layoutService, viewService, pageInfo, rect }: Props) => {
  const { layout, isSnapshot, triggerdByExpandOrCollapse } = layoutService;
  // Use mutable prop as there is no need to fetch new data when only rect changes
  const maxVisibleGrid = useMutableNebulaProp(getMaxVisibleRowsAndColumns(rect));

  // Need to keep track of loading state to prevent double renders when a new layout is received, ex after expanding or collapsing.
  // A double render would cause the scroll position to be lost
  return useFetch<EngineAPI.INxPivotPage[]>(async () => {
    const { qHyperCube } = layout;
    const { maxNumberOfVisibleRows, maxNumberOfVisibleColumns } = maxVisibleGrid.current;

    if (isSnapshot) {
      return layout.snapshotData?.content?.qPivotDataPages ?? [];
    }

    if (
      model !== undefined &&
      "getHyperCubePivotData" in model &&
      (shouldFetchExpandOrCollapseData(
        triggerdByExpandOrCollapse,
        viewService,
        maxNumberOfVisibleRows,
        maxNumberOfVisibleColumns,
      ) ||
        isMissingInitialDataPages(layout, pageInfo, maxNumberOfVisibleRows, maxNumberOfVisibleColumns))
    ) {
      const fetchArea = getFetchArea(
        triggerdByExpandOrCollapse,
        viewService,
        layout.qHyperCube.qSize,
        pageInfo,
        maxNumberOfVisibleRows,
        maxNumberOfVisibleColumns,
      );

      return fetchArea ? model.getHyperCubePivotData(Q_PATH, handleMaxEnginePageSize(fetchArea)) : [];
    }

    return qHyperCube.qPivotDataPages ?? [];
    // By explicitly using layout, isSnapshot, pageInfo.page and pageInfo.rowsPerPage in the deps list. Two re-dundent page fetches are skipped on first render
  }, [
    layout,
    isSnapshot,
    model,
    viewService,
    pageInfo.page,
    pageInfo.rowsPerPage,
    maxVisibleGrid,
    triggerdByExpandOrCollapse,
  ]);
};

export default useLoadDataPages;
