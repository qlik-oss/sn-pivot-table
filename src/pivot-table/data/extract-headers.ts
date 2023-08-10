import { PSEUDO_DIMENSION_INDEX } from "../../constants";
import type { ExtendedDimensionInfo, PseudoDimension } from "../../types/QIX";
import type { HeaderTitle } from "../../types/types";
import getKey from "../components/helpers/get-key";

const extractHeaders = (
  rowCount: number,
  sortedLeftDimensionInfo: (ExtendedDimensionInfo | PseudoDimension)[]
): (null | HeaderTitle)[][] => {
  const matrix: (null | HeaderTitle)[][] = Array(sortedLeftDimensionInfo.length)
    .fill(null)
    .map(() => Array.from({ length: rowCount }, () => null));

  sortedLeftDimensionInfo.forEach((qDimensionInfo, colIdx) => {
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
