import { useMemo } from '@nebula.js/stardust';
import createDataService from '../services/data-service';
import { PivotLayout } from '../types/QIX';
import { DataService } from '../types/types';

const useDataService = (layout: PivotLayout): DataService => useMemo(() => createDataService(layout.qHyperCube), [layout]);

export default useDataService;
