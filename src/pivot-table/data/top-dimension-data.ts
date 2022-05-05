import { TopDimensionData } from '../../types/types';
import extractTopGrid from './extract-top';
import createDimInfoToIndexMapCallback from './helpers/dimension-info-to-index-map';

export const addPageToTopDimensionData = (prevData: TopDimensionData, nextDataPage: EngineAPI.INxPivotPage): TopDimensionData => {
  const {
    qTop,
    qArea,
  } = nextDataPage;
  if (!qTop.length) return prevData;

  const nextGrid = extractTopGrid(prevData.grid, qTop, qArea);
  const nextData = nextGrid.map(row => row.filter(cell => typeof cell !== 'undefined'));
  const width = Math.max(prevData.size.x, qArea.qWidth + qArea.qLeft);

  return {
    ...prevData,
    data: nextData,
    grid: nextGrid,
    size: {
      x: width,
      y: nextData.length
    }
  };
};

export const createTopDimensionData = (
  dataPage: EngineAPI.INxPivotPage,
  qHyperCube: EngineAPI.IHyperCube,
  ): TopDimensionData => {
  const {
    qArea,
    qTop
  } = dataPage;
  const {
    qEffectiveInterColumnSortOrder,
    qNoOfLeftDims,
  } = qHyperCube;
  const grid = extractTopGrid([], qTop, qArea);
  const data = grid.map(row => row.filter(cell => typeof cell !== 'undefined'));
  const dimensionInfoIndexMap = data.map(createDimInfoToIndexMapCallback(qNoOfLeftDims, qEffectiveInterColumnSortOrder));

  return {
    data,
    grid,
    dimensionInfoIndexMap,
    size: {
      x: qArea.qWidth + qArea.qLeft,
      y: data.length
      },
  };
};
