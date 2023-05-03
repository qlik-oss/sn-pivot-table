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

const useLoadDataPages = (model: Model, layoutService: LayoutService, viewService: ViewService): UseLoadDataPages => {
  const { qHyperCube, snapshotData } = layoutService.layout;
  const { qLastExpandedPos, qSize } = qHyperCube;
  // Need to keep track of loading state to prevent double renders when a new layout is recieved, ex after expanding or collapesing.
  // A double render would cause the scroll position to be lost
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ref = useMemo(() => ({ isLoading: true }), [layoutService]);
  const [qPivotDataPages, setDataPages] = useState<EngineAPI.INxPivotPage[]>([]);

  usePromise(async () => {
    if ((model as EngineAPI.IGenericObject)?.getHyperCubePivotData && !snapshotData) {
      // If a cell have been expanded. Fetch data to the last scrolled position.
      if (shouldFetchAdditionalData(qLastExpandedPos, viewService)) {
        try {
          const pivotPages = await (model as EngineAPI.IGenericObject).getHyperCubePivotData(Q_PATH, [
            {
              qLeft: viewService.gridColumnStartIndex,
              qTop: viewService.gridRowStartIndex,
              qWidth: viewService.gridWidth,
              qHeight: viewService.gridHeight,
            },
          ]);

          setDataPages(pivotPages);
        } catch (error) {
          // TODO handle error
          console.error(error);
        }
      } else {
        setDataPages([]);
      }
    }

    ref.isLoading = false;
  }, [qLastExpandedPos, qSize, model, viewService, snapshotData]);

  return {
    qPivotDataPages,
    isLoading: ref.isLoading,
  };
};

export default useLoadDataPages;
