import { PivotDimensionCellWithPosition } from '../../../types/types';
import findParentPseudoDimension from './find-parent-pseudo-dimension';

const createMeasureInfoIndexMap = (matrix: PivotDimensionCellWithPosition[][], qMeasureInfo: EngineAPI.INxMeasureInfo[]): number[] => (matrix[matrix.length - 1] || []).map(cell => {
  const { qText } = findParentPseudoDimension(cell) || {};
  const idx = qMeasureInfo.findIndex(measureInfo => measureInfo.qFallbackTitle ===  qText);
  if (idx === -1) {
    return 0; // Fallback solution when there is only a single measure, as in no pseudo dimenions.
  };

  return idx;
});

export const getMeasureInfoIndexFromCell = (cell: PivotDimensionCellWithPosition, qMeasureInfo: EngineAPI.INxMeasureInfo[]): number => {
  const { qText } = findParentPseudoDimension(cell) || {};
  const idx = qMeasureInfo.findIndex(measureInfo => measureInfo.qFallbackTitle ===  qText);
  if (idx === -1) {
    return 0; // Fallback solution when there is only a single measure, as in no pseudo dimenions.
  };

  return idx;
};

export default createMeasureInfoIndexMap;
