import NxDimCellType from "../../types/QIX";
import type { MeasureData, PageInfo } from "../../types/types";
import getRandomUUID from "./helpers/get-random-uuid";

export interface AddPageToMeasureDataProps {
  prevData: MeasureData;
  dataPage: EngineAPI.INxPivotPage;
  pageInfo: PageInfo;
}

interface CreateGridProps {
  qArea: EngineAPI.IRect;
  prevData: MeasureData;
  pivotValuePoints: EngineAPI.INxPivotValuePoint[][];
  pageInfo: PageInfo;
}

const createNewGrid = ({ qArea, prevData, pivotValuePoints, pageInfo }: CreateGridProps) => {
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

      // If cell already exist do not create a new cell
      data[pageRowIndex][columnIndex] = data[pageRowIndex][columnIndex] ?? {
        id: getRandomUUID(),
        ref: node,
        isNull,
      };
    });
  });

  return data;
};

export const addPageToMeasureData = ({ prevData, dataPage, pageInfo }: AddPageToMeasureDataProps): MeasureData => {
  const { qData, qArea } = dataPage;

  if (!qData.length) return prevData;

  return createNewGrid({
    qArea,
    prevData,
    pivotValuePoints: qData as unknown as EngineAPI.INxPivotValuePoint[][],
    pageInfo,
  });
};

export const createMeasureData = (dataPage: EngineAPI.INxPivotPage, pageInfo: PageInfo): MeasureData => {
  const { qData, qArea } = dataPage;

  return createNewGrid({
    qArea,
    prevData: [],
    pivotValuePoints: qData as unknown as EngineAPI.INxPivotValuePoint[][],
    pageInfo,
  });
};
