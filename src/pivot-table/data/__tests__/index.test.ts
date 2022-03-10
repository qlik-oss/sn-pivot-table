import createData, { findParentPseudoDimension } from '../index';
import extractHeaders from '../extract-headers';
import extractLeft from '../extract-left';
import extractTop from '../extract-top';
import { PivotDimensionCellWithPosition } from '../../../types/types';
import NxDimCellType from '../../../types/QIX';

jest.mock('../extract-headers');
jest.mock('../extract-left');
jest.mock('../extract-top');

const mockedExtractHeaders = extractHeaders as jest.MockedFunction<typeof extractHeaders>;
const mockedExtractLeft = extractLeft as jest.MockedFunction<typeof extractLeft>;
const mockedExtractTop = extractTop as jest.MockedFunction<typeof extractTop>;

function createPivotPage(): EngineAPI.INxPivotPage {
  return {
    qLeft: [],
    qTop: [],
    qData: [],
    qArea: { qWidth: 0, qHeight: 0, qLeft: 0, qTop: 0 }
  };
}

let dimInfo: EngineAPI.INxDimensionInfo[] = [];
let measInfo: EngineAPI.INxMeasureInfo[] = [];

describe('createData', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    mockedExtractHeaders.mockReturnValue([]);
    mockedExtractLeft.mockReturnValue([]);
    mockedExtractTop.mockReturnValue([]);

    dimInfo = [];
    measInfo = [];
  });

  test('should return correct left data', () => {
    const left = [['a', 'b']];
    mockedExtractLeft.mockReturnValue(left);
    const pivotPage = createPivotPage();

    const data = createData(pivotPage, dimInfo, measInfo);

    expect(data.left).toEqual(left);
    expect(data.size.left.x).toBe(1);
    expect(data.size.left.y).toBe(2);
  });

  test('should return correct top data', () => {
    const top = [[{} as PivotDimensionCellWithPosition], [{} as PivotDimensionCellWithPosition]];
    mockedExtractTop.mockReturnValue(top);
    const pivotPage = createPivotPage();

    const data = createData(pivotPage, dimInfo, measInfo);

    expect(data.top).toEqual(top);
    expect(data.size.top.x).toBe(1);
    expect(data.size.top.y).toBe(2);
  });

  test('should return correct headers data', () => {
    const headers = [['a', 'b']];
    mockedExtractHeaders.mockReturnValue(headers);
    const pivotPage = createPivotPage();

    const data = createData(pivotPage, dimInfo, measInfo);

    expect(data.headers).toEqual(headers);
    expect(data.size.headers.x).toBe(1);
    expect(data.size.headers.y).toBe(2);
  });

  test('should return correct data', () => {
    const pivotPage = createPivotPage();
    pivotPage.qArea.qWidth = 1;
    pivotPage.qArea.qHeight = 2;
    pivotPage.qData = [[]] as unknown as EngineAPI.INxPivotValuePoint[];

    const data = createData(pivotPage, dimInfo, measInfo);

    expect(data.data).toEqual(pivotPage.qData);
    expect(data.size.data.x).toBe(pivotPage.qArea.qWidth);
    expect(data.size.data.y).toBe(pivotPage.qArea.qHeight);
  });

  test('should return correct total row and column count', () => {
    const pivotPage = createPivotPage();
    pivotPage.qArea.qWidth = 1;
    pivotPage.qArea.qHeight = 2;
    const top = [[{} as PivotDimensionCellWithPosition, {} as PivotDimensionCellWithPosition], [{} as PivotDimensionCellWithPosition, {} as PivotDimensionCellWithPosition]];
    mockedExtractTop.mockReturnValue(top);
    const left = [['a', 'b']];
    mockedExtractLeft.mockReturnValue(left);

    const data = createData(pivotPage, dimInfo, measInfo);

    expect(data.size.totalColumns).toBe(2);
    expect(data.size.totalRows).toBe(4);
  });

  test('should return measureInfoIndexMap', () => {
    measInfo = [
      { qFallbackTitle: 'm0' } as EngineAPI.INxMeasureInfo,
      { qFallbackTitle: 'm1' } as EngineAPI.INxMeasureInfo
    ];
    const top = [
      [
        { qText: 'm0', qType: NxDimCellType.NX_DIM_CELL_PSEUDO } as PivotDimensionCellWithPosition,
        { qText: 'm1', qType: NxDimCellType.NX_DIM_CELL_PSEUDO } as PivotDimensionCellWithPosition
      ]
    ];
    mockedExtractTop.mockReturnValue(top);
    const pivotPage = createPivotPage();

    const data = createData(pivotPage, dimInfo, measInfo);

    expect(data.measureInfoIndexMap).toHaveLength(2);
    expect(data.measureInfoIndexMap).toEqual(expect.arrayContaining([0, 1]));
  });

  test('measureInfoIndexMap should handle when there is no pseudo dimensions', () => {
    measInfo = [
      { qFallbackTitle: 'm0' } as EngineAPI.INxMeasureInfo,
      { qFallbackTitle: 'm1' } as EngineAPI.INxMeasureInfo
    ];
    const top = [
      [
        { qText: 'm0', qType: NxDimCellType.NX_DIM_CELL_NORMAL } as PivotDimensionCellWithPosition,
        { qText: 'm1', qType: NxDimCellType.NX_DIM_CELL_NORMAL } as PivotDimensionCellWithPosition
      ]
    ];
    mockedExtractTop.mockReturnValue(top);
    const pivotPage = createPivotPage();

    const data = createData(pivotPage, dimInfo, measInfo);

    expect(data.measureInfoIndexMap).toHaveLength(2);
    expect(data.measureInfoIndexMap).toEqual(expect.arrayContaining([0, 0]));
  });
});

describe('findParentPseudoDimension', () => {
  test('should return cell if it is a pseudo dimension cell', () => {
    const cell = { qType: NxDimCellType.NX_DIM_CELL_PSEUDO } as PivotDimensionCellWithPosition;
    const pseudoDimCell = findParentPseudoDimension(cell);
    expect(pseudoDimCell).toBe(cell);
  });

  test('should return cell parent is a pseudo dimension cell', () => {
    const parent = { qType: NxDimCellType.NX_DIM_CELL_PSEUDO } as PivotDimensionCellWithPosition;
    const cell = { qType: NxDimCellType.NX_DIM_CELL_NORMAL, parent } as PivotDimensionCellWithPosition;
    const pseudoDimCell = findParentPseudoDimension(cell);
    expect(pseudoDimCell).toBe(parent);
  });

  test('should return cell parents parent is a pseudo dimension cell', () => {
    const parentParent = { qType: NxDimCellType.NX_DIM_CELL_PSEUDO } as PivotDimensionCellWithPosition;
    const parent = { qType: NxDimCellType.NX_DIM_CELL_NORMAL, parent: parentParent } as PivotDimensionCellWithPosition;
    const cell = { qType: NxDimCellType.NX_DIM_CELL_NORMAL, parent } as PivotDimensionCellWithPosition;
    const pseudoDimCell = findParentPseudoDimension(cell);
    expect(pseudoDimCell).toBe(parentParent);
  });

  test('should return return null when cell has no parent', () => {
    const cell = { qType: NxDimCellType.NX_DIM_CELL_NORMAL, parent: null } as PivotDimensionCellWithPosition;
    const pseudoDimCell = findParentPseudoDimension(cell);
    expect(pseudoDimCell).toBe(null);
  });

  test('should return return null when no cell is a pseudo dimension', () => {
    const parent = { qType: NxDimCellType.NX_DIM_CELL_NORMAL } as PivotDimensionCellWithPosition;
    const cell = { qType: NxDimCellType.NX_DIM_CELL_NORMAL, parent } as PivotDimensionCellWithPosition;
    const pseudoDimCell = findParentPseudoDimension(cell);
    expect(pseudoDimCell).toBe(null);
  });
});
