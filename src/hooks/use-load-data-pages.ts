import { DEFAULT_PAGE_SIZE, Q_PATH } from "../constants";
import type { Model, PivotLayout } from "../types/QIX";
import type { LayoutService, PageInfo, ViewService } from "../types/types";
import useFetch from "./use-fetch";

interface Props {
  model: Model;
  layoutService: LayoutService;
  viewService: ViewService;
  pageInfo: PageInfo;
}

export const shouldFetchAdditionalData = (
  qLastExpandedPos: EngineAPI.INxCellPosition | undefined,
  viewService: ViewService
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
  if (qTop < pageInfo.currentPage * pageInfo.rowsPerPage) return true;
  // otherwise check if we are missing data
  return qWidth < Math.min(DEFAULT_PAGE_SIZE, qSize.qcx) || qHeight < Math.min(DEFAULT_PAGE_SIZE, qSize.qcy);
};

const useLoadDataPages = ({ model, layoutService, viewService, pageInfo }: Props) => {
  const { layout, isSnapshot } = layoutService;

  // Need to keep track of loading state to prevent double renders when a new layout is received, ex after expanding or collapsing.
  // A double render would cause the scroll position to be lost
  return useFetch<EngineAPI.INxPivotPage[]>(async () => {
    const { qHyperCube } = layout;
    const { qLastExpandedPos } = qHyperCube;

    if (isSnapshot) {
      return layout.snapshotData?.content?.qPivotDataPages || [];
    }

    if (
      (model as EngineAPI.IGenericObject)?.getHyperCubePivotData &&
      (shouldFetchAdditionalData(qLastExpandedPos, viewService) || isMissingLayoutData(layout, pageInfo))
    ) {
      const fetchArea: EngineAPI.INxPage = {
        qLeft: qLastExpandedPos ? viewService.gridColumnStartIndex : 0,
        qTop: pageInfo.currentPage * pageInfo.rowsPerPage + (qLastExpandedPos ? viewService.gridRowStartIndex : 0),
        qWidth: !viewService.gridWidth ? DEFAULT_PAGE_SIZE : viewService.gridWidth,
        qHeight: !viewService.gridHeight ? DEFAULT_PAGE_SIZE : viewService.gridHeight,
      };
      return (model as EngineAPI.IGenericObject).getHyperCubePivotData(Q_PATH, [fetchArea]);
    }
    return qHyperCube.qPivotDataPages;
  }, [layout, isSnapshot, model, viewService, pageInfo.currentPage, pageInfo.rowsPerPage]); // By explicitly using layout, isSnapshot, pageInfo.currentPage and pageInfo.rowsPerPage in the deps list. Two re-dundent page fetches are skipped on first render
};
export default useLoadDataPages;
