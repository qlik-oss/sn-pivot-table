import { ViewService } from '../types/types';

const createViewService = (): ViewService => ({
    shouldResetScroll: false,
    gridColumnStartIndex: 0,
    gridRowStartIndex: 0,
    gridWidth: 0,
    gridHeight: 0
  });

export default createViewService;
