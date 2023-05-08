import type { PageInfo } from "../../hooks/use-pivot-table";
import type { MeasureData } from "../../types/types";

const createNewGrid = (
  qArea: EngineAPI.IRect,
  prevData: EngineAPI.INxPivotValuePoint[][],
  nextData: EngineAPI.INxPivotValuePoint[][],
  pageInfo: PageInfo,
  isNewPage = false
) => {
  const data = [...prevData];
  nextData.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const topIdx = isNewPage ? 0 : qArea.qTop - pageInfo.currentPage * pageInfo.rowsPerPage;
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
  isNewPage?: boolean;
}

export const addPageToMeasureData = ({
  prevData,
  nextDataPage,
  isNewPage,
  pageInfo,
}: AddPageToMeasureDataProps): MeasureData => {
  const { qData, qArea } = nextDataPage;
  if (!qData.length) return prevData;

  return createNewGrid(
    qArea,
    isNewPage ? [] : prevData,
    qData as unknown as EngineAPI.INxPivotValuePoint[][],
    pageInfo,
    isNewPage
  );
};

export const createMeasureData = (dataPage: EngineAPI.INxPivotPage): MeasureData => {
  const { qData } = dataPage;
  const grid = qData as unknown as EngineAPI.INxPivotValuePoint[][];

  return [...grid].map((row) => [...row]);
};
