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

export const shouldFetchAdditionalData = (qLastExpandedPos: EngineAPI.INxCellPosition | undefined) => {
  if (!qLastExpandedPos) {
    return false;
  }

  return qLastExpandedPos.qx >= DEFAULT_PAGE_SIZE || qLastExpandedPos.qy >= DEFAULT_PAGE_SIZE;
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
 * guaranteed to work with a new layout, as its properties my no longer be valid.
 */
export const getFetchArea = (
  qLastExpandedPos: EngineAPI.INxCellPosition | undefined,
  viewService: ViewService,
  qSize: EngineAPI.ISize,
  pageInfo: PageInfo,
) => {
  const pageStartTop = pageInfo.page * pageInfo.rowsPerPage;
  const pageEndTop = pageStartTop + pageInfo.rowsPerPage;

  if (qSize.qcy < pageStartTop) {
    /**
     * Do not fetch data that does not exist. This can happen because "PageInfo" is resolved from the layout.
     * Which means it will not be updated until the next render cycle.
     */
    return null;
  }

  // TODO Make sure to index vs size are correct, i.e. to -1 or not

  // TODO do qLastExpandedPos neeed to know if it was from Left or Top grid?

  let qLeft = 0;
  let qTop = 0;

  // qLastExpandedPos only exist in the layout if a new layout was received because a node was expanded or collapsed
  if (qLastExpandedPos) {
    // gridColumnStartIndex might not exist anymore in the new expanded/collapsed layout
    if (viewService.gridColumnStartIndex > qLastExpandedPos.qx) {
      qLeft = Math.max(0, qLastExpandedPos.qx - DEFAULT_PAGE_SIZE);
    } else {
      qLeft = viewService.gridColumnStartIndex;
    }

    // pageStartTop + viewService.gridRowStartIndex might not exist anymore in the new expanded/collapsed layout
    const inViewTop = pageStartTop + viewService.gridRowStartIndex;
    if (inViewTop > qLastExpandedPos.qy) {
      qTop = Math.max(0, qLastExpandedPos.qy - DEFAULT_PAGE_SIZE);
    } else {
      qTop = inViewTop;
    }
  }

  return {
    qLeft,
    qTop,
    qWidth: Math.min(MAX_COLUMN_COUNT - qLeft, qSize.qcx - qLeft, DEFAULT_PAGE_SIZE),
    qHeight: Math.min(pageEndTop - qTop, qSize.qcy - qTop, DEFAULT_PAGE_SIZE),
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
      (shouldFetchAdditionalData(qLastExpandedPos) || isMissingLayoutData(layout, pageInfo))
    ) {
      const fetchArea = getFetchArea(qLastExpandedPos, viewService, layout.qHyperCube.qSize, pageInfo);
      console.log("%c fetchArea", "color: orangered", {
        fetchArea,
        viewService: { ...viewService },
        pageInfo,
        qLastExpandedPos,
      });
      return fetchArea ? model.getHyperCubePivotData(Q_PATH, [fetchArea]) : [];
    }

    return qHyperCube.qPivotDataPages ?? [];
    // By explicitly using layout, isSnapshot, pageInfo.page and pageInfo.rowsPerPage in the deps list. Two re-dundent page fetches are skipped on first render
  }, [layout, isSnapshot, model, viewService, pageInfo.page, pageInfo.rowsPerPage]);
};

export default useLoadDataPages;
