import createData from '../index';
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

const EMPTY_GRID = [[]];
const TOP = [
  [
    { qType: NxDimCellType.NX_DIM_CELL_NORMAL } as PivotDimensionCellWithPosition,
    { qType: NxDimCellType.NX_DIM_CELL_NORMAL } as PivotDimensionCellWithPosition
  ]
];
const LEFT = [
  [
    { qType: NxDimCellType.NX_DIM_CELL_NORMAL } as PivotDimensionCellWithPosition,
    { qType: NxDimCellType.NX_DIM_CELL_NORMAL } as PivotDimensionCellWithPosition
  ]
];
let qDimensionInfo: EngineAPI.INxDimensionInfo[] = [];
let qHyperCube = {} as EngineAPI.IHyperCube;

describe('createData', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    mockedExtractHeaders.mockReturnValue(EMPTY_GRID);
    mockedExtractLeft.mockReturnValue(LEFT);
    mockedExtractTop.mockReturnValue(TOP);

    qDimensionInfo = [];
    qHyperCube = {
      qDimensionInfo,
      qNoOfLeftDims: 0,
      qEffectiveInterColumnSortOrder: [0],
    } as EngineAPI.IHyperCube;
  });

  test('should return correct left data', () => {
    mockedExtractLeft.mockReturnValue(LEFT);
    mockedExtractTop.mockReturnValue(TOP);
    const pivotPage = createPivotPage();
    const data = createData(pivotPage, qHyperCube);

    expect(data.left).toEqual(LEFT);
    expect(data.leftGrid).toEqual(LEFT);
  });

  test('should return correct top data', () => {
    mockedExtractLeft.mockReturnValue(LEFT);
    mockedExtractTop.mockReturnValue(TOP);
    const pivotPage = createPivotPage();
    const data = createData(pivotPage, qHyperCube);

    expect(data.top).toEqual(TOP);
    expect(data.topGrid).toEqual(TOP);
  });

  test('should return correct headers data', () => {
    const headers = [['a', 'b']];
    mockedExtractHeaders.mockReturnValue(headers);
    const pivotPage = createPivotPage();

    const data = createData(pivotPage, qHyperCube);

    expect(data.headers).toEqual(headers);
    expect(data.size.headers.x).toBe(1);
    expect(data.size.headers.y).toBe(2);
  });

  test('should return correct data', () => {
    const pivotPage = createPivotPage();
    pivotPage.qData = [
      [{}],
      [{}, {}, {}]
    ] as unknown as EngineAPI.INxPivotValuePoint[];

    const data = createData(pivotPage, qHyperCube);

    expect(data.data).toEqual(pivotPage.qData);
    expect(data.size.data.x).toBe(3);
    expect(data.size.data.y).toBe(2);
  });

  test('should return correct total row and column count', () => {
    const pivotPage = createPivotPage();
    pivotPage.qData = [
      [{}],
      [{}, {}, {}]
    ] as unknown as EngineAPI.INxPivotValuePoint[];

    const data = createData(pivotPage, qHyperCube);

    expect(data.size.totalColumns).toBe(4);
    expect(data.size.totalRows).toBe(3);
  });
});
