import createData, { addDataPage, addPage } from '../pivot-table/data';
import { DataService } from '../types/types';

const createDataService = (qHyperCube: EngineAPI.IHyperCube): DataService => {
  let data = createData(qHyperCube.qPivotDataPages[0], qHyperCube);

  return {
    addPage: (nextDataPage: EngineAPI.INxPivotPage) => {
      data = addPage(data, nextDataPage);
    },
    addDataPage: (nextDataPage: EngineAPI.INxPivotPage) => {
      data = addDataPage(data, nextDataPage);
    },
    hasMoreRows: () => data.size.data.y < qHyperCube.qSize.qcy,
    hasMoreColumns: () => data.size.data.x < qHyperCube.qSize.qcx,
    getData: () => data,
  };
};

export default createDataService;
