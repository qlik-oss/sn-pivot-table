/*  eslint-disable no-param-reassign */
import { useMemo, usePromise, useState } from '@nebula.js/stardust';
import { Q_PATH } from '../constants';
import createDataService from '../services/data-service';
import { DataService, LayoutService, ViewService } from '../types/types';

interface UseDataService {
  dataService: DataService;
  isLoading: boolean;
  setNextPivotPage: (page: EngineAPI.INxPivotPage) => void;
}

const MAX_GRID_SIZE = 10000;

const safeGuardGridSize = (viewService: ViewService):boolean => {
  const { gridWidth, gridHeight } = viewService;
  if (!gridWidth) return true;
  if (!gridHeight) return true;
  if (gridWidth < 0) return true;
  if (gridHeight < 0) return true;
  return false;
};

const getPagesToTheTop = (viewService: ViewService, maxHeight: number): EngineAPI.IRect[] => {
  const { gridColumnStartIndex, gridRowStartIndex, gridWidth, gridHeight } = viewService;
  const pages = [] as EngineAPI.IRect[];

  if (safeGuardGridSize(viewService)) { // handle zero size and when viewService has not yet been initialized
    return pages;
  }

  const totalHeight = Math.min(gridRowStartIndex + (gridHeight * 2), maxHeight);
  const batchSize = Math.floor(MAX_GRID_SIZE / gridWidth);
  let batchTop = Math.max(0, totalHeight - batchSize);
  let batchHeight = totalHeight - batchTop;

  do {
    pages.unshift({
      qLeft: gridColumnStartIndex,
      qTop: Math.max(0, batchTop),
      qWidth: gridWidth,
      qHeight: batchHeight,
    });

    batchHeight = Math.min(batchHeight, batchTop);
    batchTop -= batchSize;

  } while (pages[0]?.qTop > 0);

  return pages;
};

const getPagesToTheLeft = (viewService: ViewService, maxWidth: number): EngineAPI.IRect[] => {
  const { gridColumnStartIndex, gridRowStartIndex, gridWidth, gridHeight } = viewService;
  const pages = [] as EngineAPI.IRect[];

  if (safeGuardGridSize(viewService)) { // handle zero size and when viewService has not yet been initialized
    return pages;
  }

  const totalWidth = Math.min(gridColumnStartIndex + (gridWidth * 2), maxWidth);
  const batchSize = Math.floor(MAX_GRID_SIZE / gridHeight);
  let batchLeft = Math.max(0, totalWidth - batchSize);
  let batchWidth = totalWidth - batchLeft;

  do {
    pages.unshift({
      qLeft: Math.max(0, batchLeft),
      qTop: gridRowStartIndex,
      qWidth: batchWidth,
      qHeight: gridHeight,
    });

    batchWidth = Math.min(batchWidth, batchLeft);
    batchLeft -= batchSize;

  } while (pages[0]?.qLeft > 0);

  return pages;
};

const useDataService = (
  model: EngineAPI.IGenericObject | undefined,
  layoutService: LayoutService,
  viewService: ViewService
): UseDataService => {
  const { qHyperCube } = layoutService.layout;
  const { qLastExpandedPos, qSize } = qHyperCube;
  // Need to keep track of loading state to prevent double renders when a new layout is recieved, ex after expanding or collapesing.
  // A double render would cause the scroll position to be lost
  const ref = useMemo(() => ({ isLoading: true }), [layoutService]);
  const dataService = useMemo(() => createDataService(qHyperCube), [layoutService]);
  // This state is needed to trigger re-renders when a new page is loaded from the data model. It's bit of a hack and should be fixed.
  const [nextPivotPage, setNextPivotPage] = useState<EngineAPI.INxPivotPage | null>(null);

  useMemo(() => {
    if (nextPivotPage) {
      dataService.addPage(nextPivotPage);
    }
  }, [nextPivotPage]);

  usePromise(async () => {
    if (model) {
      // If a cell have been expanded. Fetch data to the last scrolled position.
      if (qLastExpandedPos) {
        const pages = [
          ...getPagesToTheLeft(viewService, qSize.qcx),
          ...getPagesToTheTop(viewService, qSize.qcy)
        ];
        const fetchPageQueries = pages.map(async (page) => {
          const [pivotPage] = await model.getHyperCubePivotData(Q_PATH, [page]);
          dataService.addPage(pivotPage);
        });
        await Promise.all(fetchPageQueries)
          .catch(e => {
            // TODO handle error
            console.error(e);
          });
          viewService.shouldResetScroll = false;
      } else {
        // Layout was received because of a property change or selection change (confirmed or cancelled)
        viewService.shouldResetScroll = true;
      }
    }

    ref.isLoading = false;
  }, [qLastExpandedPos, qSize, model, viewService, dataService]);

  return {
    dataService,
    setNextPivotPage,
    isLoading: ref.isLoading
  };
};

export default useDataService;
