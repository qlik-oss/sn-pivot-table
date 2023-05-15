/*  eslint-disable no-param-reassign */
import { useMemo, usePromise, useState } from "@nebula.js/stardust";
import { DEFAULT_PAGE_SIZE, Q_PATH } from "../constants";
import type { Model } from "../types/QIX";
import type { LayoutService, PageInfo, ViewService } from "../types/types";

interface UseLoadDataPages {
  (args: { model: Model; layoutService: LayoutService; viewService: ViewService; pageInfo: PageInfo }): {
    isLoading: boolean;
    qPivotDataPages: EngineAPI.INxPivotPage[];
  };
}

const shouldFetchAdditionalData = (
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

const isMissingLayoutData = (layoutService: LayoutService, pageInfo: PageInfo): boolean => {
  const {
    qHyperCube: { qPivotDataPages, qSize },
  } = layoutService.layout;
  const { qTop, qWidth, qHeight } = qPivotDataPages[0]?.qArea ?? { qTop: 0, qWidth: 0, qHeight: 0 };

  // in case of new page -> return true
  if (qTop < pageInfo.currentPage * pageInfo.rowsPerPage) return true;
  // otherwise check if we are missing data
  return qWidth < Math.min(DEFAULT_PAGE_SIZE, qSize.qcx) || qHeight < Math.min(DEFAULT_PAGE_SIZE, qSize.qcy);
};

const useLoadDataPages: UseLoadDataPages = ({ model, layoutService, viewService, pageInfo }) => {
  const { qHyperCube, snapshotData } = layoutService.layout;
  const { qLastExpandedPos } = qHyperCube;
  // Need to keep track of loading state to prevent double renders when a new layout is recieved, ex after expanding or collapesing.
  // A double render would cause the scroll position to be lost
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ref = useMemo(() => ({ isLoading: true }), [layoutService]);
  const [qPivotDataPages, setDataPages] = useState<EngineAPI.INxPivotPage[]>([]);

  usePromise(async () => {
    if (layoutService.isSnapshot) {
      setDataPages(layoutService.layout.snapshotData?.content?.qPivotDataPages || []);
    } else if (
      (model as EngineAPI.IGenericObject)?.getHyperCubePivotData &&
      (shouldFetchAdditionalData(qLastExpandedPos, viewService) || isMissingLayoutData(layoutService, pageInfo))
    ) {
      try {
        const fetchArea: EngineAPI.INxPage = {
          qLeft: qLastExpandedPos ? viewService.gridColumnStartIndex : 0,
          qTop: pageInfo.currentPage * pageInfo.rowsPerPage + (qLastExpandedPos ? viewService.gridRowStartIndex : 0),
          qWidth: !viewService.gridWidth ? DEFAULT_PAGE_SIZE : viewService.gridWidth,
          qHeight: !viewService.gridHeight ? DEFAULT_PAGE_SIZE : viewService.gridHeight,
        };
        const pivotPages = await (model as EngineAPI.IGenericObject).getHyperCubePivotData(Q_PATH, [fetchArea]);
        setDataPages(pivotPages);
      } catch (error) {
        // TODO handle error
        console.error(error);
      }
    } else if (qHyperCube.qPivotDataPages.length) {
      setDataPages(qHyperCube.qPivotDataPages);
    }

    ref.isLoading = false;
  }, [layoutService.layout, model, viewService, snapshotData, pageInfo]);

  return {
    qPivotDataPages,
    isLoading: ref.isLoading,
  };
};

export default useLoadDataPages;
