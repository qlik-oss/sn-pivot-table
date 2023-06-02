import type { ExtendedPivotValuePoint } from "../../types/QIX";
import type { LayoutService, MeasureData, PageInfo } from "../../types/types";
import { resolveToRGBAorRGB } from "./helpers/color-utils";

const createNewGrid = (
  qArea: EngineAPI.IRect,
  prevData: ExtendedPivotValuePoint[][],
  nextData: ExtendedPivotValuePoint[][],
  pageInfo: PageInfo,
  layoutService: LayoutService
) => {
  const data = [...prevData];
  nextData.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const topIdx = qArea.qTop - pageInfo.currentPage * pageInfo.rowsPerPage;
      if (!Array.isArray(data[topIdx + rowIndex])) {
        data[topIdx + rowIndex] = [];
      }
      const measureInfoIndex = layoutService.getMeasureInfoIndexFromCellIndex(qArea.qLeft + colIndex);
      const exprColorIds = layoutService.colorByExpressionIndex.measures[measureInfoIndex];
      const foregroundColorValue = (cell.qAttrExps as unknown as EngineAPI.INxAttributeExpressionValues)?.qValues?.[
        exprColorIds.foregroundColorIdx
      ]?.qText;
      const backgroundColorValue = (cell.qAttrExps as unknown as EngineAPI.INxAttributeExpressionValues)?.qValues?.[
        exprColorIds.backgroundColorIdx
      ]?.qText;

      data[topIdx + rowIndex][qArea.qLeft + colIndex] = {
        ...cell,
        foregroundColor: foregroundColorValue ? resolveToRGBAorRGB(foregroundColorValue) : undefined,
        backgroundColor: backgroundColorValue ? resolveToRGBAorRGB(backgroundColorValue) : undefined,
      };
    });
  });

  return data;
};

export interface AddPageToMeasureDataProps {
  prevData: MeasureData;
  nextDataPage: EngineAPI.INxPivotPage;
  pageInfo: PageInfo;
  layoutService: LayoutService;
}

export const addPageToMeasureData = ({
  prevData,
  nextDataPage,
  pageInfo,
  layoutService,
}: AddPageToMeasureDataProps): MeasureData => {
  const { qData, qArea } = nextDataPage;
  if (!qData.length) return prevData;

  return createNewGrid(qArea, prevData, qData as unknown as EngineAPI.INxPivotValuePoint[][], pageInfo, layoutService);
};

export const createMeasureData = (
  dataPage: EngineAPI.INxPivotPage,
  pageInfo: PageInfo,
  layoutService: LayoutService
): MeasureData => {
  const { qData, qArea } = dataPage;
  const grid = qData as unknown as ExtendedPivotValuePoint[][];

  return createNewGrid(qArea, [], grid, pageInfo, layoutService);
};
