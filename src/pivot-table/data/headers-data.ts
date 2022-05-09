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
  const data = extractHeaders(qDimensionInfo, rowCount, dimensionInfoIndexMap);

  return {
    data,
    size: {
      x: data.length,
      y: data[0]?.length || 0,
    }
  };
};

export default createHeadersData;
