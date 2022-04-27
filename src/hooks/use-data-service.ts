/*  eslint-disable no-param-reassign */
import { useMemo, usePromise } from '@nebula.js/stardust';
import { Q_PATH } from '../constants';
import createDataService from '../services/data-service';
import { DataService, LayoutService, ViewService } from '../types/types';

interface UseDataService {
  dataService: DataService;
  isLoading: boolean;
}

const MAX_GRID_SIZE = 10000;

const getPagesToTheTop = (viewService: ViewService, maxHeight: number): EngineAPI.IRect[] => {
  const { gridColumnStartIndex, gridRowStartIndex, gridWidth, gridHeight } = viewService;
  const pages = [] as EngineAPI.IRect[];

  if (!gridWidth && !gridHeight) { // handle zero size and when viewService has not yet been initialized
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

  if (!gridWidth && !gridHeight) { // handle zero size and when viewService has not yet been initialized
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
  const ref = useMemo(() => ({ isLoading: true }), [layoutService]);
  const dataService = useMemo(() => createDataService(qHyperCube), [layoutService]);

  usePromise(async () => {
    if (model) {
      // If a cell have been expanded. Fetch data to the last scrolled position.
      if (qLastExpandedPos) {
        const pages = [
          ...getPagesToTheLeft(viewService, qSize.qcx),
          ...getPagesToTheTop(viewService, qSize.qcy)
        ];
        const fetchPageQueries = pages.map(async (page) => {
          const [nextPivotPage] = await model.getHyperCubePivotData(Q_PATH, [page]);
          dataService.addPage(nextPivotPage);
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
    isLoading: ref.isLoading
  };
};

export default useDataService;
