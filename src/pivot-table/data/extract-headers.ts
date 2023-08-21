import { PSEUDO_DIMENSION_INDEX } from "../../constants";
import type { Header, HeaderType, VisibleDimensionInfo } from "../../types/types";
import getKey from "../components/helpers/get-key";
import getTitle from "../components/helpers/get-title";
import { create, transpose } from "./helpers/matrix";

/**
 * Creates a matrix containing dimension headers for header grid. rows x columns
 */
const extractHeaders = (
  visibleTopDimensions: VisibleDimensionInfo[],
  visibleLeftDimensions: VisibleDimensionInfo[]
): (null | Header)[][] => {
  type DimensionInfoIndexMapMatrixRow = {
    visibleDimensions: VisibleDimensionInfo[];
    type: "left" | "top";
  };

  const createMatrix = (
    lastRow: DimensionInfoIndexMapMatrixRow,
    lastCol: DimensionInfoIndexMapMatrixRow
  ): (null | Header)[][] => {
    const extractHeaderTitle = (
      type: HeaderType,
      dimension: VisibleDimensionInfo,
      lastDimension: boolean,
      includeMeasures: boolean
    ): Header => {
      const header = {
        id: getKey(dimension),
        title: getTitle(dimension),
        approximateMaxGlyphCount: dimension === PSEUDO_DIMENSION_INDEX ? 0 : dimension.qApprMaxGlyphCount,
        type: lastDimension ? (`${type}_last` as HeaderType) : type,
        includeMeasures,
      };
      return header;
    };

    let includeMeasures = false;
    let lastColPruned = lastCol.visibleDimensions;
    if (lastCol.visibleDimensions.at(-1) === PSEUDO_DIMENSION_INDEX) {
      lastColPruned = lastCol.visibleDimensions.slice(0, -1);
      includeMeasures = lastCol.type === "left";
    }
    const rowCount = lastColPruned.length + 1;
    const colCount = Math.max(1, lastRow.visibleDimensions.length);
    const matrix: (null | Header)[][] = create(rowCount, colCount);

    lastRow.visibleDimensions.forEach((dimension, i, array) => {
      matrix[rowCount - 1][i] = extractHeaderTitle(lastRow.type, dimension, i === array.length - 1, includeMeasures);
    });

    lastColPruned.forEach((dimension, i, array) => {
      matrix[i][colCount - 1] = extractHeaderTitle(lastCol.type, dimension, i === array.length - 1, includeMeasures);
    });

    return matrix;
  };

  let matrix: (null | Header)[][];

  // if pseudo dimension is in top map, create left x top matrix
  // else if pseudo dimension is in left map or if there is none pseudo dimension, create top x left matrix and then transpose
  if (visibleTopDimensions.length === 0 || visibleTopDimensions.includes(PSEUDO_DIMENSION_INDEX)) {
    matrix = createMatrix(
      { visibleDimensions: visibleLeftDimensions, type: "left" },
      { visibleDimensions: visibleTopDimensions, type: "top" }
    );
  } else {
    matrix = createMatrix(
      { visibleDimensions: visibleTopDimensions, type: "top" },
      { visibleDimensions: visibleLeftDimensions, type: "left" }
    );
    matrix = transpose(matrix);
  }

  return matrix;
};

export default extractHeaders;
