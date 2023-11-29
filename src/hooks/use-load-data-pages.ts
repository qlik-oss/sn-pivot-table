import type { stardust } from "@nebula.js/stardust";
import { useFetch } from "@qlik/nebula-table-utils/lib/hooks";
import { DEFAULT_PAGE_SIZE, Q_PATH } from "../constants";
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

export const shouldFetchAdditionalData = (
  qLastExpandedPos: EngineAPI.INxCellPosition | undefined,
  viewService: ViewService,
  maxNumberOfVisibleRows: number,
  maxNumberOfVisibleColumns: number,
) => {
  if (!qLastExpandedPos) {
    return false;
  }

  return (
    viewService.gridColumnStartIndex + viewService.gridWidth >= maxNumberOfVisibleColumns ||
    viewService.gridRowStartIndex + viewService.gridHeight >= maxNumberOfVisibleRows
  );
};

export const isMissingLayoutData = (
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
  qLastExpandedPos: EngineAPI.INxCellPosition | undefined,
  viewService: ViewService,
  qSize: EngineAPI.ISize,
  pageInfo: PageInfo,
  maxNumberOfVisibleRows: number,
  maxNumberOfVisibleColumns: number,
) => {
  const pageStartIndex = pageInfo.page * pageInfo.rowsPerPage;
  const pageEndIndex = pageStartIndex + pageInfo.rowsPerPage;

  if (qSize.qcy < pageStartIndex) {
    /**
     * Do not fetch data that does not exist. This can happen because "PageInfo" is resolved from the layout.
     * Which means it will not be updated until the next render cycle.
     */
    return null;
  }

  let qLeft = 0;
  let qTop = pageStartIndex;

  /**
   * Things that can happen
   * qLastExpandedPos equals the position at which was expanded or collapsed. No data was added or removed before the position.
   * qLastExpandedPos does not equal the position as which it was expanded/collapsed. Data was added or removed before the position.
   *
   * Data before the position is removed: viewService.gridColumnStartInde and viewService.gridRowStartIndex are now STALE.
   * As the position might no longer exist. Can that be checked?
   *
   * Data before the position is added: viewService.gridColumnStartInde and viewService.gridRowStartIndex are still valid.
   * But might not be where the cell was expanded.
   */

  // qLastExpandedPos only exist in the layout if a new layout was received because a node was expanded or collapsed
  if (qLastExpandedPos) {
    if (viewService.lastExpandedOrCollapsed.grid === "left") {
      const lastRow = viewService.gridRowStartIndex + viewService.gridHeight;

      if (qLastExpandedPos.qy === viewService.lastExpandedOrCollapsed.rowIndex) {
        // No data was added before or after the expand/collapse position
        console.log("%c No data was added before or after the expand/collapse position", "color: lime");
        qTop = pageStartIndex + viewService.gridRowStartIndex;
      } else if (qLastExpandedPos.qy > viewService.lastExpandedOrCollapsed.rowIndex) {
        // Data was added before the expanded position
        console.log("%c Data was added before the expanded position", "color: salmon");
        qTop = pageStartIndex + viewService.gridRowStartIndex;
      } else if (lastRow > qSize.qcy) {
        // Data was removed before the collapsed position, last row no longer exists
        console.log("%c Data was removed before the collapsed position, last row no longer exists", "color: yellow");

        qTop = Math.max(0, qSize.qcy - maxNumberOfVisibleRows);
        //  qLastExpandedPos.qy - distanceFromTopWhenCollapsing;
      } else {
        // Data was removed before the collapsed position
        console.log("%c Data was remove before the collapsed position", "color: orange");
        qTop = pageStartIndex + viewService.gridRowStartIndex;
      }
      // qTop = Math.max(0, Math.min(qSize.qcy - DEFAULT_PAGE_SIZE, qLastExpandedPos.qy));
    }

    // gridColumnStartIndex might not exist anymore in the new expanded/collapsed layout
    qLeft = Math.max(0, Math.min(qSize.qcx - DEFAULT_PAGE_SIZE, viewService.gridColumnStartIndex));
    // pageStartTop + viewService.gridRowStartIndex might not exist anymore in the new expanded/collapsed layout
    // qTop = Math.max(0, Math.min(qSize.qcy - DEFAULT_PAGE_SIZE, pageStartIndex + viewService.gridRowStartIndex));
    console.log("%c qSize.qcy - maxNumberOfVisibleRows", "color: orangered", {
      "qSize.qcy - maxNumberOfVisibleRows": qSize.qcy - maxNumberOfVisibleRows,
      "qSize.qcy - DEFAULT_PAGE_SIZE": qSize.qcy - DEFAULT_PAGE_SIZE,
      "qSize.qcy": qSize.qcy,
      maxNumberOfVisibleRows,
      qLastExpandedPos,
      qTop,
    });
  }

  return {
    qLeft,
    qTop,
    qWidth: Math.min(MAX_COLUMN_COUNT - qLeft, qSize.qcx - qLeft, maxNumberOfVisibleColumns),
    qHeight: Math.min(pageEndIndex - qTop, qSize.qcy - qTop, maxNumberOfVisibleRows),
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
  const { layout, isSnapshot } = layoutService;
  // Use mutable prop as there is no need to fetch new data when only rect changes
  const maxVisibleGrid = useMutableNebulaProp(getMaxVisibleRowsAndColumns(rect));

  // Need to keep track of loading state to prevent double renders when a new layout is received, ex after expanding or collapsing.
  // A double render would cause the scroll position to be lost
  return useFetch<EngineAPI.INxPivotPage[]>(async () => {
    const { qHyperCube } = layout;
    const { qLastExpandedPos } = qHyperCube;
    const { maxNumberOfVisibleRows, maxNumberOfVisibleColumns } = maxVisibleGrid.current;

    if (isSnapshot) {
      return layout.snapshotData?.content?.qPivotDataPages ?? [];
    }

    if (
      model !== undefined &&
      "getHyperCubePivotData" in model &&
      (shouldFetchAdditionalData(qLastExpandedPos, viewService, maxNumberOfVisibleRows, maxNumberOfVisibleColumns) ||
        isMissingLayoutData(layout, pageInfo, maxNumberOfVisibleRows, maxNumberOfVisibleColumns))
    ) {
      const fetchArea = getFetchArea(
        qLastExpandedPos,
        viewService,
        layout.qHyperCube.qSize,
        pageInfo,
        maxNumberOfVisibleRows,
        maxNumberOfVisibleColumns,
      );
      console.log("%c fetchArea", "color: orangered", fetchArea, { ...viewService });
      return fetchArea ? model.getHyperCubePivotData(Q_PATH, handleMaxEnginePageSize(fetchArea)) : [];
    }

    return qHyperCube.qPivotDataPages ?? [];
    // By explicitly using layout, isSnapshot, pageInfo.page and pageInfo.rowsPerPage in the deps list. Two re-dundent page fetches are skipped on first render
  }, [layout, isSnapshot, model, viewService, pageInfo.page, pageInfo.rowsPerPage, maxVisibleGrid]);
};

export default useLoadDataPages;
