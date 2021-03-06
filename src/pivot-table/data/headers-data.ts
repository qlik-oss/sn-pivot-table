import { HeadersData } from '../../types/types';
import extractHeaders from './extract-headers';

const createHeadersData = (
  qHyperCube: EngineAPI.IHyperCube,
  rowCount: number,
  dimensionInfoIndexMap: number[],
): HeadersData => {
  const {
    qDimensionInfo,
  } = qHyperCube;
  // rowCount cannot be 0, as it couse issue when there is no top data but there is left data
  const data = extractHeaders(qDimensionInfo, Math.max(rowCount, 1), dimensionInfoIndexMap);

  return {
    data,
    size: {
      x: data.length,
      y: data[0]?.length || 0,
    }
  };
};

export default createHeadersData;
