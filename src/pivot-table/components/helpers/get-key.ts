import { PSEUDO_DIMENSION_INDEX } from "../../../constants";

const getKey = (dimIndex: number, qDimensionInfo: EngineAPI.INxDimensionInfo[]): string =>
  dimIndex === PSEUDO_DIMENSION_INDEX ? "-1" : `${qDimensionInfo[dimIndex].qFallbackTitle}-${dimIndex}`;

export default getKey;
