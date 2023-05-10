/*  eslint-disable no-param-reassign */
import { useMemo, usePromise, useState } from "@nebula.js/stardust";
import { DEFAULT_PAGE_SIZE, Q_PATH } from "../constants";
import type { Model } from "../types/QIX";
import type { LayoutService, ViewService } from "../types/types";

interface UseLoadDataPages {
  isLoading: boolean;
  qPivotDataPages: EngineAPI.INxPivotPage[];
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

const isMissingLayoutData = (layoutService: LayoutService): boolean => {
  const { qHyperCube } = layoutService.layout;
  // if qPivotDataPages is array
  if (Array.isArray(qHyperCube.qPivotDataPages)) {
    if (
      // if qPivotDataPages not contains data
      qHyperCube.qPivotDataPages.length === 0 ||
      // if qPivotDataPages has data but it is empty
      qHyperCube.qPivotDataPages[0].qData.length === 0 ||
      // ???
      (qHyperCube.qPivotDataPages[0].qArea.qWidth < DEFAULT_PAGE_SIZE &&
        qHyperCube.qSize.qcx !== qHyperCube.qPivotDataPages[0].qArea.qWidth) ||
      // ???
      (qHyperCube.qPivotDataPages[0].qArea.qHeight < DEFAULT_PAGE_SIZE &&
        qHyperCube.qSize.qcy !== qHyperCube.qPivotDataPages[0].qArea.qHeight)
    ) {
      return true;
    }
    return true;
  }

  return false;
};

const useLoadDataPages = (model: Model, layoutService: LayoutService, viewService: ViewService): UseLoadDataPages => {
  const { qHyperCube, snapshotData } = layoutService.layout;
  const { qLastExpandedPos } = qHyperCube;
  // Need to keep track of loading state to prevent double renders when a new layout is recieved, ex after expanding or collapesing.
  // A double render would cause the scroll position to be lost
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ref = useMemo(() => ({ isLoading: true }), [layoutService]);
  const [qPivotDataPages, setDataPages] = useState<EngineAPI.INxPivotPage[]>([]);

  usePromise(async () => {
    if ((model as EngineAPI.IGenericObject)?.getHyperCubePivotData && !snapshotData) {
      // If a cell have been expanded. Fetch data to the last scrolled position.
      // otherwise check if we need to fetch
      if (shouldFetchAdditionalData(qLastExpandedPos, viewService) || isMissingLayoutData(layoutService)) {
        try {
          const pivotPages = await (model as EngineAPI.IGenericObject).getHyperCubePivotData(Q_PATH, [
            {
              qLeft: qLastExpandedPos ? viewService.gridColumnStartIndex : 0,
              qTop: qLastExpandedPos ? viewService.gridRowStartIndex : 0,
              qWidth: !viewService.gridWidth ? DEFAULT_PAGE_SIZE : viewService.gridWidth,
              qHeight: !viewService.gridHeight ? DEFAULT_PAGE_SIZE : viewService.gridHeight,
            },
          ]);

          setDataPages([...qHyperCube.qPivotDataPages, ...pivotPages]);
        } catch (error) {
          // TODO handle error
          console.error(error);
        }
      } else {
        // when we get new page
        setDataPages(qHyperCube.qPivotDataPages);
      }
    } else {
      // use snapshot data
      setDataPages(layoutService.layout.snapshotData?.content?.qPivotDataPages || []);
    }

    ref.isLoading = false;
  }, [layoutService.layout, model, viewService, snapshotData]);

  return {
    qPivotDataPages,
    isLoading: ref.isLoading,
  };
};

export default useLoadDataPages;
