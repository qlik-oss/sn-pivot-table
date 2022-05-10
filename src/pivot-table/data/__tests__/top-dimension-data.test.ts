import { createTopDimensionData, addPageToTopDimensionData } from '../top-dimension-data';
import extractTopGrid from '../extract-top';
import NxDimCellType from '../../../types/QIX';
import { Cell } from '../../../types/types';

jest.mock('../extract-top');
const mockedExtractTop = extractTopGrid as jest.MockedFunction<typeof extractTopGrid>;

describe('top dimension data', () => {
  const CELL = { ref: { qType: NxDimCellType.NX_DIM_CELL_NORMAL } } as Cell;
  const qHyperCube = {
    qEffectiveInterColumnSortOrder: [0],
    qNoOfLeftDims: 0,
  } as EngineAPI.IHyperCube;
  const dataPage = {
    qTop: [],
    qArea: {
      qWidth: 1,
      qLeft: 2
    }
  } as unknown as EngineAPI.INxPivotPage;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('create', () => {
    test('should return correct data', () => {
      const mockedReturnValue = [[CELL, undefined, CELL]] as Cell[][];
      mockedExtractTop.mockReturnValue(mockedReturnValue);
      const data = createTopDimensionData(dataPage, qHyperCube);

      expect(data.data).toEqual([[CELL, CELL]]);
      expect(data.grid).toEqual(mockedReturnValue);
      expect(data.dimensionInfoIndexMap).toEqual([0]);
      expect(data.size.x).toEqual(dataPage.qArea.qWidth + dataPage.qArea.qLeft);
      expect(data.size.y).toEqual(1);
    });
  });

  describe('add page to', () => {
    test('should add page to data', () => {
      const nextTop = [[undefined, undefined, CELL]] as Cell[][];
      mockedExtractTop.mockReturnValue(nextTop);
      const data = createTopDimensionData(dataPage, qHyperCube);
      const nextDataPage = {
        qTop: [{}],
        qArea: {
          qWidth: 2,
          qLeft: 3
        }
      } as unknown as EngineAPI.INxPivotPage;
      const nextData = addPageToTopDimensionData(data, nextDataPage);

      expect(nextData.data).toEqual([[CELL]]);
      expect(nextData.grid).toEqual(nextTop);
      expect(nextData.dimensionInfoIndexMap).toEqual([0]);
      expect(nextData.size.x).toEqual(nextDataPage.qArea.qWidth + nextDataPage.qArea.qLeft);
      expect(nextData.size.y).toEqual(1);
    });

    test('should return previous page if qLeft is an empty array', () => {
      const nextTop = [[undefined, undefined, CELL]] as Cell[][];
      mockedExtractTop.mockReturnValue(nextTop);
      const data = createTopDimensionData(dataPage, qHyperCube);
      const nextDataPage = {
        qTop: [],
        qArea: {
          qWidth: 2,
          qLeft: 3
        }
      } as unknown as EngineAPI.INxPivotPage;
      const nextData = addPageToTopDimensionData(data, nextDataPage);

      expect(nextData).toBe(data);
    });

    test('should compare width with previous data and return the largest value', () => {
      const nextTop = [[undefined, undefined, CELL]] as Cell[][];
      mockedExtractTop.mockReturnValue(nextTop);
      const data = createTopDimensionData(dataPage, qHyperCube);
      const nextDataPage = {
        qTop: [{}],
        qArea: {
          qWidth: 2,
          qLeft: 3
        }
      } as unknown as EngineAPI.INxPivotPage;
      data.size.x = 100;
      const nextData = addPageToTopDimensionData(data, nextDataPage);

      expect(nextData.size.x).toEqual(data.size.x);
    });
  });
});
