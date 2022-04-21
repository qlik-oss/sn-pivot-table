import { renderHook } from '@testing-library/react-hooks';
import NxDimCellType from '../../../types/QIX';
import { DataModel, PivotDimensionCellWithPosition, Rect } from '../../../types/types';
import useColumnWidth, { EXPAND_ICON_WIDTH } from '../use-column-width';
import useMeasureText, { MeasureTextHook } from '../use-measure-text';

jest.mock('../use-measure-text');

describe('useColumnWidth', () => {
  let rect: Rect;
  let mockedUseMeasureText: jest.MockedFunction<(size: string, fam: string) => MeasureTextHook>;
  let mockedDataModel: DataModel;
  let mockedMeasureText: MeasureTextHook;

  beforeEach(() => {
    const cell = { qType: NxDimCellType.NX_DIM_CELL_NORMAL } as EngineAPI.INxPivotDimensionCell;
    const dimInfo = { qApprMaxGlyphCount: 1 } as EngineAPI.INxDimensionInfo;
    const meaInfo = { qFallbackTitle: 1, qApprMaxGlyphCount: 0 } as unknown as EngineAPI.INxMeasureInfo;
    rect = { width: 200, height: 100 };
    mockedUseMeasureText = useMeasureText as jest.MockedFunction<typeof useMeasureText>;
    mockedDataModel = {
      getDimensionInfo: () => [dimInfo, dimInfo, dimInfo],
      getMeasureInfo: () => [meaInfo, meaInfo, meaInfo],
      getNoLeftDims: () => 3,
      pivotData: {
        left: [[cell], [cell], [cell]],
        leftDimensionInfoIndexMap: [0, 1, 2],
        size: {
          data: {
            x: 3
          }
        }
      }
    } as unknown as DataModel;

    mockedMeasureText = {
      measureText: jest.fn() as jest.MockedFunction<(text: string) => number>,
      estimateWidth: jest.fn() as jest.MockedFunction<(length: number) => number>
    };
    mockedUseMeasureText.mockReturnValue(mockedMeasureText);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('grid width', () => {
    test('should return left and right grid widths with only dimension cells and glyph size > then text size', () => {
      rect.width = 290;
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(50);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(25);

      const { result } = renderHook(() => useColumnWidth(mockedDataModel, rect));
      expect(result.current.leftGridWidth).toBe(((50 + EXPAND_ICON_WIDTH) * 2) + 50);
      expect(result.current.rightGridWidth).toBe(80);
    });

    test('should return left and right grid widths with only dimension cells and glyph size < then text size', () => {
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(25);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(50);

      const { result } = renderHook(() => useColumnWidth(mockedDataModel, rect));
      expect(result.current.leftGridWidth).toBe(150);
      expect(result.current.rightGridWidth).toBe(50);
    });

    test('should return left and right grid width with dimension and pseudo dimension cells', () => {
      const cell = { qType: NxDimCellType.NX_DIM_CELL_NORMAL } as PivotDimensionCellWithPosition;
      const pCell = { qType: NxDimCellType.NX_DIM_CELL_PSEUDO } as PivotDimensionCellWithPosition;
      const dimInfo = { qApprMaxGlyphCount: 1 } as EngineAPI.INxDimensionInfo;
      const meaInfo = { qFallbackTitle: 1 } as unknown as EngineAPI.INxMeasureInfo;
      mockedDataModel.pivotData.left = [[cell], [pCell], [cell]];
      mockedDataModel.pivotData.leftDimensionInfoIndexMap = [0, -1, 1];
      mockedDataModel.getDimensionInfo = () => [dimInfo, dimInfo, dimInfo];
      mockedDataModel.getMeasureInfo = () => [meaInfo];
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(50);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(35);

      const { result } = renderHook(() => useColumnWidth(mockedDataModel, rect));
      expect(result.current.leftGridWidth).toBe(150);
      expect(result.current.rightGridWidth).toBe(50);
    });

    test('left grid can not take more space then 75% of the total width available', () => {
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(100);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(50);

      const { result } = renderHook(() => useColumnWidth(mockedDataModel, rect));
      expect(result.current.leftGridWidth).toBe(rect.width * 0.75);
      expect(result.current.rightGridWidth).toBe(rect.width * 0.25);
    });
  });

  describe('getLeftColumnWidth', () => {
    test('should return left column width', () => {
      rect.width = 500;
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValueOnce(25);
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValueOnce(50);
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValueOnce(75);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(5);

      const { result } = renderHook(() => useColumnWidth(mockedDataModel, rect));
      expect(result.current.getLeftColumnWidth(0)).toBe(25 + EXPAND_ICON_WIDTH);
      expect(result.current.getLeftColumnWidth(1)).toBe(50 + EXPAND_ICON_WIDTH);
      expect(result.current.getLeftColumnWidth(2)).toBe(75);
    });
  });

  describe('getDataColumnWidth', () => {
    test('should return minimum data column width of 100', () => {
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(50);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(50);
      mockedDataModel.pivotData.size.data.x = 3;

      const { result } = renderHook(() => useColumnWidth(mockedDataModel, rect));
      expect(result.current.getDataColumnWidth(0)).toBe(100);
      expect(result.current.getDataColumnWidth(1)).toBe(100);
      expect(result.current.getDataColumnWidth(2)).toBe(100);
    });

    test('should return data column width based of available right grid width', () => {
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(10);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(10);
      mockedDataModel.pivotData.size.data.x = 3;
      rect.width = 600;

      const { result } = renderHook(() => useColumnWidth(mockedDataModel, rect));
      expect(result.current.getDataColumnWidth(0)).toBe(170);
      expect(result.current.getDataColumnWidth(1)).toBe(170);
      expect(result.current.getDataColumnWidth(2)).toBe(170);
    });

    test('should not return data column width based of available right grid width when total data column width is larger than available right grid width', () => {
      const m0 = { qFallbackTitle: 'm0', qApprMaxGlyphCount: 0 } as unknown as EngineAPI.INxMeasureInfo;
      const m1 = { qFallbackTitle: 'm1', qApprMaxGlyphCount: 0 } as unknown as EngineAPI.INxMeasureInfo;
      const m2 = { qFallbackTitle: 'm2', qApprMaxGlyphCount: 0 } as unknown as EngineAPI.INxMeasureInfo;
      mockedDataModel.getMeasureInfo = () => [m0, m1, m2];
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(10);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockImplementation((title) => {
        switch (title) {
          case 'm0':
            return 600;
          case 'm1':
            return 200;
          case 'm2':
            return 150;
          default:
            return 10;
        }
      });
      mockedDataModel.pivotData.size.data.x = 3;
      rect.width = 600;

      const { result } = renderHook(() => useColumnWidth(mockedDataModel, rect));
      expect(result.current.getDataColumnWidth(0)).toBe(600);
      expect(result.current.getDataColumnWidth(1)).toBe(200);
      expect(result.current.getDataColumnWidth(2)).toBe(150);
    });

    test('should return data column width based of estimated width', () => {
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(150);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(10);
      mockedDataModel.pivotData.size.data.x = 3;
      rect.width = 600;

      const { result } = renderHook(() => useColumnWidth(mockedDataModel, rect));
      expect(result.current.getDataColumnWidth(0)).toBe(150);
      expect(result.current.getDataColumnWidth(1)).toBe(150);
      expect(result.current.getDataColumnWidth(2)).toBe(150);
    });

    test('should return data column width based of measured title width', () => {
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(50);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(250);
      mockedDataModel.pivotData.size.data.x = 3;
      rect.width = 600;

      const { result } = renderHook(() => useColumnWidth(mockedDataModel, rect));
      expect(result.current.getDataColumnWidth(0)).toBe(250);
      expect(result.current.getDataColumnWidth(1)).toBe(250);
      expect(result.current.getDataColumnWidth(2)).toBe(250);
    });
  });

  describe('getTotalWidth', () => {
    test('should return total width', () => {
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(100);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(100);
      mockedDataModel.pivotData.size.data.x = 30;

      const { result } = renderHook(() => useColumnWidth(mockedDataModel, rect));
      expect(result.current.getTotalWidth()).toBe(150 + (30 * 100));
    });
  });

  describe('totalMeasureInfoColumnWidth', () => {
    test('should return total width', () => {
      (mockedMeasureText.estimateWidth as jest.MockedFunction<(length: number) => number>).mockReturnValue(100);
      (mockedMeasureText.measureText as jest.MockedFunction<(text: string) => number>).mockReturnValue(175);
      mockedDataModel.pivotData.size.data.x = 30;

      const { result } = renderHook(() => useColumnWidth(mockedDataModel, rect));
      expect(result.current.totalMeasureInfoColumnWidth).toBe(175 * 3);
    });
  });
});
