import type { MeasureData, PageInfo } from "../../types/types";

const createNewGrid = (
  qArea: EngineAPI.IRect,
  prevData: EngineAPI.INxPivotValuePoint[][],
  nextData: EngineAPI.INxPivotValuePoint[][],
  pageInfo: PageInfo
) => {
  const data = [...prevData];
  nextData.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const topIdx = qArea.qTop - pageInfo.currentPage * pageInfo.rowsPerPage;
      if (!Array.isArray(data[topIdx + rowIndex])) {
        data[topIdx + rowIndex] = [];
      }
      data[topIdx + rowIndex][qArea.qLeft + colIndex] = cell;
    });
  });

  return data;
};

export interface AddPageToMeasureDataProps {
  prevData: MeasureData;
  nextDataPage: EngineAPI.INxPivotPage;
  pageInfo: PageInfo;
}

export const addPageToMeasureData = ({ prevData, nextDataPage, pageInfo }: AddPageToMeasureDataProps): MeasureData => {
  const { qData, qArea } = nextDataPage;
  if (!qData.length) return prevData;

  return createNewGrid(qArea, prevData, qData as unknown as EngineAPI.INxPivotValuePoint[][], pageInfo);
};

export const createMeasureData = (dataPage: EngineAPI.INxPivotPage, pageInfo: PageInfo): MeasureData => {
  const { qData, qArea } = dataPage;
  const grid = qData as unknown as EngineAPI.INxPivotValuePoint[][];

  return createNewGrid(qArea, [], grid, pageInfo);
};
