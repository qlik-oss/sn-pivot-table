import { MeasureData } from '../../types/types';

const createNewGrid = (qArea: EngineAPI.IRect, prevData: EngineAPI.INxPivotValuePoint[][], nextData: EngineAPI.INxPivotValuePoint[][]) => {
  const data = [...prevData];
  nextData.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (!Array.isArray(data[qArea.qTop + rowIndex])) {
        data[qArea.qTop + rowIndex] = [];
      }
      data[qArea.qTop + rowIndex][qArea.qLeft + colIndex] = cell;
    });
  });

  return data;
};

export const addPageToMeasureData = (prevData: MeasureData, nextDataPage: EngineAPI.INxPivotPage): MeasureData => {
  const {
    qData,
    qArea,
  } = nextDataPage;
  if (!qData.length) return prevData;

  const data = createNewGrid(qArea, prevData.data, qData as unknown as EngineAPI.INxPivotValuePoint[][]);

  return {
    ...prevData,
    data,
    size: {
      x: Math.max(prevData.size.x, qArea.qWidth + qArea.qLeft),
      y: Math.max(prevData.size.y, qArea.qHeight + qArea.qTop)
    }
  };
};

export const createMeasureData = (dataPage: EngineAPI.INxPivotPage): MeasureData => {
  const { qData, qArea } = dataPage;

  return {
    data: [...(qData as unknown as EngineAPI.INxPivotValuePoint[][])].map(row => [...row]),
    size: {
      x: qArea.qWidth + qArea.qLeft,
      y: qArea.qHeight + qArea.qTop
    }
  };
};
