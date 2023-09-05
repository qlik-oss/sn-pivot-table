import { PSEUDO_DIMENSION_INDEX } from "../../constants";
import type { HeaderTitle, VisibleDimensionInfo } from "../../types/types";
import getKey from "../components/helpers/get-key";

const extractHeaders = (
  rowCount: number,
  visibleLeftDimensionInfo: VisibleDimensionInfo[],
): (null | HeaderTitle)[][] => {
  const matrix: (null | HeaderTitle)[][] = Array(visibleLeftDimensionInfo.length)
    .fill(null)
    .map(() => Array.from({ length: rowCount }, () => null));

  visibleLeftDimensionInfo.forEach((qDimensionInfo, colIdx) => {
    if (qDimensionInfo === PSEUDO_DIMENSION_INDEX) {
      matrix[colIdx][rowCount - 1] = { id: "PSEUDO-DIM", title: "" };
    } else {
      const id: string = getKey(qDimensionInfo);
      matrix[colIdx][rowCount - 1] = { id, title: qDimensionInfo.qFallbackTitle };
    }
  });

  return matrix;
};

export default extractHeaders;
