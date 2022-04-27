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
    get hasMoreRows() {
      return data.size.data.y < qHyperCube.qSize.qcy;
    },
    get hasMoreColumns() {
      return data.size.data.x < qHyperCube.qSize.qcx;
    },
    get data() {
      return data;
    },
    get size() {
      return data.size;
    },
  };
};

export default createDataService;
