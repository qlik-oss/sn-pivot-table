import { HeadersData, LeftDimensionData, TopDimensionData } from '../../types/types';
import extractHeaders from './extract-headers';

const createHeadersData = (
  qHyperCube: EngineAPI.IHyperCube,
  topDimensionData: TopDimensionData,
  leftDimensionData: LeftDimensionData,
): HeadersData => {
  const {
    qDimensionInfo,
  } = qHyperCube;
  const data = extractHeaders(qDimensionInfo, topDimensionData.size.y, leftDimensionData.dimensionInfoIndexMap);

  return {
    data,
    size: {
      x: data.length,
      y: data[0]?.length || 0,
    }
  };
};

export default createHeadersData;
