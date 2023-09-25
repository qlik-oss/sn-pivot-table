import { useFetch } from "@qlik/nebula-table-utils/lib/hooks";
import { DEFAULT_PAGE_SIZE, Q_PATH } from "../constants";
import { MAX_COLUMN_COUNT } from "../pivot-table/constants";
import type { Model, PivotLayout } from "../types/QIX";
import type { LayoutService, PageInfo, ViewService } from "../types/types";

interface Props {
  model: Model;
  layoutService: LayoutService;
  viewService: ViewService;
  pageInfo: PageInfo;
}

export const shouldFetchAdditionalData = (
  qLastExpandedPos: EngineAPI.INxCellPosition | undefined,
  viewService: ViewService,
) => {
  if (!qLastExpandedPos) {
    return false;
  }

  return (
    viewService.gridColumnStartIndex + viewService.gridWidth >= DEFAULT_PAGE_SIZE ||
    viewService.gridRowStartIndex + viewService.gridHeight >= DEFAULT_PAGE_SIZE
  );
};

export const isMissingLayoutData = (layout: PivotLayout, pageInfo: PageInfo): boolean => {
  const {
    qHyperCube: { qPivotDataPages, qSize },
  } = layout;
  const { qTop, qWidth, qHeight } = qPivotDataPages[0]?.qArea ?? { qTop: 0, qWidth: 0, qHeight: 0 };

  // in case of new page -> return true
  if (qTop < pageInfo.page * pageInfo.rowsPerPage) return true;
  // otherwise check if we are missing data
  return qWidth < Math.min(DEFAULT_PAGE_SIZE, qSize.qcx) || qHeight < Math.min(DEFAULT_PAGE_SIZE, qSize.qcy);
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

  // qLastExpandedPos only exist in the layout if a new layout was received because a node was expanded or collapsed
  if (qLastExpandedPos) {
    // gridColumnStartIndex might not exist anymore in the new expanded/collapsed layout
    qLeft = Math.max(0, Math.min(qSize.qcx - DEFAULT_PAGE_SIZE, viewService.gridColumnStartIndex));
    // pageStartTop + viewService.gridRowStartIndex might not exist anymore in the new expanded/collapsed layout
    qTop = Math.max(0, Math.min(qSize.qcy - DEFAULT_PAGE_SIZE, pageStartIndex + viewService.gridRowStartIndex));
  }

  return {
    qLeft,
    qTop,
    qWidth: Math.min(MAX_COLUMN_COUNT - qLeft, qSize.qcx - qLeft, DEFAULT_PAGE_SIZE),
    qHeight: Math.min(pageEndIndex - qTop, qSize.qcy - qTop, DEFAULT_PAGE_SIZE),
  };
};

const useLoadDataPages = ({ model, layoutService, viewService, pageInfo }: Props) => {
  const { layout, isSnapshot } = layoutService;

  // Need to keep track of loading state to prevent double renders when a new layout is received, ex after expanding or collapsing.
  // A double render would cause the scroll position to be lost
  return useFetch<EngineAPI.INxPivotPage[]>(async () => {
    const { qHyperCube } = layout;
    const { qLastExpandedPos } = qHyperCube;

    if (isSnapshot) {
      return layout.snapshotData?.content?.qPivotDataPages ?? [];
    }

    if (
      model !== undefined &&
      "getHyperCubePivotData" in model &&
      (shouldFetchAdditionalData(qLastExpandedPos, viewService) || isMissingLayoutData(layout, pageInfo))
    ) {
      const fetchArea = getFetchArea(qLastExpandedPos, viewService, layout.qHyperCube.qSize, pageInfo);

      return fetchArea ? model.getHyperCubePivotData(Q_PATH, [fetchArea]) : [];
    }

    return qHyperCube.qPivotDataPages ?? [];
    // By explicitly using layout, isSnapshot, pageInfo.page and pageInfo.rowsPerPage in the deps list. Two re-dundent page fetches are skipped on first render
  }, [layout, isSnapshot, model, viewService, pageInfo.page, pageInfo.rowsPerPage]);
};

export default useLoadDataPages;
