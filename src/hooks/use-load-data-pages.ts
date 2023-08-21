import { DEFAULT_PAGE_SIZE, Q_PATH } from "../constants";
import type { Model } from "../types/QIX";
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

export const isMissingLayoutData = (layoutService: LayoutService, pageInfo: PageInfo): boolean => {
  const {
    qHyperCube: { qPivotDataPages, qSize },
  } = layoutService.layout;
  const { qTop, qWidth, qHeight } = qPivotDataPages[0]?.qArea ?? { qTop: 0, qWidth: 0, qHeight: 0 };

  // in case of new page -> return true
  if (qTop < pageInfo.currentPage * pageInfo.rowsPerPage) return true;
  // otherwise check if we are missing data
  return qWidth < Math.min(DEFAULT_PAGE_SIZE, qSize.qcx) || qHeight < Math.min(DEFAULT_PAGE_SIZE, qSize.qcy);
};

const useLoadDataPages = ({ model, layoutService, viewService, pageInfo }: Props) =>
  // Need to keep track of loading state to prevent double renders when a new layout is received, ex after expanding or collapsing.
  // A double render would cause the scroll position to be lost

  useFetch<EngineAPI.INxPivotPage[]>(async () => {
    const { qHyperCube } = layoutService.layout;
    const { qLastExpandedPos } = qHyperCube;

    if (layoutService.isSnapshot) {
      return layoutService.layout.snapshotData?.content?.qPivotDataPages || [];
    }

    if (
      (model as EngineAPI.IGenericObject)?.getHyperCubePivotData &&
      (shouldFetchAdditionalData(qLastExpandedPos, viewService) || isMissingLayoutData(layoutService, pageInfo))
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
  }, [layoutService, model, viewService, pageInfo]);
export default useLoadDataPages;
