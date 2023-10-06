import NxDimCellType from "../../types/QIX";
import type { AttrExprInfoIndex, LayoutService, MeasureData, PageInfo } from "../../types/types";
import getExpressionColor from "./helpers/get-expression-color";

export interface AddPageToMeasureDataProps {
  prevData: MeasureData;
  dataPage: EngineAPI.INxPivotPage;
  pageInfo: PageInfo;
  attrExprInfoIndexes: AttrExprInfoIndex[];
  layoutService: LayoutService;
}

interface CreateGridProps {
  qArea: EngineAPI.IRect;
  prevData: MeasureData;
  pivotValuePoints: EngineAPI.INxPivotValuePoint[][];
  pageInfo: PageInfo;
  attrExprInfoIndexes: AttrExprInfoIndex[];
  hasPseudoDimOnLeft: boolean;
}

const createNewGrid = ({
  qArea,
  prevData,
  pivotValuePoints,
  pageInfo,
  attrExprInfoIndexes,
  hasPseudoDimOnLeft,
}: CreateGridProps) => {
  const measureCount = attrExprInfoIndexes.length;
  const data = [...prevData];

  pivotValuePoints.forEach((row, rowIndex) => {
    row.forEach((node, colIndex) => {
      const topIdx = qArea.qTop - pageInfo.page * pageInfo.rowsPerPage;
      const pageRowIndex = topIdx + rowIndex;
      const columnIndex = qArea.qLeft + colIndex;

      if (!Array.isArray(data[pageRowIndex])) {
        data[pageRowIndex] = [];
      }

      const isNull = node.qType === NxDimCellType.NX_DIM_CELL_NULL;
      const measureInfoIndex = hasPseudoDimOnLeft ? pageRowIndex % measureCount : columnIndex % measureCount;

      // If cell already exist do not create a new cell
      data[pageRowIndex][columnIndex] = data[pageRowIndex][columnIndex] ?? {
        ref: node,
        isNull,
        expressionColor: getExpressionColor(attrExprInfoIndexes[measureInfoIndex], node),
      };
    });
  });

  return data;
};

export const addPageToMeasureData = ({
  prevData,
  dataPage,
  pageInfo,
  attrExprInfoIndexes,
  layoutService,
}: AddPageToMeasureDataProps): MeasureData => {
  const { qData, qArea } = dataPage;
  const { hasPseudoDimOnLeft } = layoutService;

  if (!qData.length) return prevData;

  return createNewGrid({
    qArea,
    prevData,
    pivotValuePoints: qData as unknown as EngineAPI.INxPivotValuePoint[][],
    pageInfo,
    attrExprInfoIndexes,
    hasPseudoDimOnLeft,
  });
};

export const createMeasureData = (
  dataPage: EngineAPI.INxPivotPage,
  pageInfo: PageInfo,
  attrExprInfoIndexes: AttrExprInfoIndex[],
  layoutService: LayoutService,
): MeasureData => {
  const { qData, qArea } = dataPage;
  const { hasPseudoDimOnLeft } = layoutService;

  return createNewGrid({
    qArea,
    prevData: [],
    pivotValuePoints: qData as unknown as EngineAPI.INxPivotValuePoint[][],
    pageInfo,
    attrExprInfoIndexes,
    hasPseudoDimOnLeft,
  });
};
