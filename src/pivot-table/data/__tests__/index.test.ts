import createData from '../index';
import extractHeaders from '../extract-headers';
import extractLeft from '../extract-left';
import extractTop from '../extract-top';

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

const dimInfo: EngineAPI.INxDimensionInfo[] = [];

describe('createData', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    mockedExtractHeaders.mockReturnValue([]);
    mockedExtractLeft.mockReturnValue([]);
    mockedExtractTop.mockReturnValue([]);
  });

  test('should return correct left data', () => {
    const left = [['a', 'b']];
    mockedExtractLeft.mockReturnValue(left);
    const pivotPage = createPivotPage();

    const data = createData(pivotPage, dimInfo);

    expect(data.left).toEqual(left);
    expect(data.size.left.x).toBe(1);
    expect(data.size.left.y).toBe(2);
  });

  test('should return correct top data', () => {
    const top = [['a', 'b']];
    mockedExtractTop.mockReturnValue(top);
    const pivotPage = createPivotPage();

    const data = createData(pivotPage, dimInfo);

    expect(data.top).toEqual(top);
    expect(data.size.top.x).toBe(1);
    expect(data.size.top.y).toBe(2);
  });

  test('should return correct headers data', () => {
    const headers = [['a', 'b']];
    mockedExtractHeaders.mockReturnValue(headers);
    const pivotPage = createPivotPage();

    const data = createData(pivotPage, dimInfo);

    expect(data.headers).toEqual(headers);
    expect(data.size.headers.x).toBe(1);
    expect(data.size.headers.y).toBe(2);
  });

  test('should return correct data', () => {
    const pivotPage = createPivotPage();
    pivotPage.qArea.qWidth = 1;
    pivotPage.qArea.qHeight = 2;
    pivotPage.qData = [[]] as unknown as EngineAPI.INxPivotValuePoint[];

    const data = createData(pivotPage, dimInfo);

    expect(data.data).toEqual(pivotPage.qData);
    expect(data.size.data.x).toBe(pivotPage.qArea.qWidth);
    expect(data.size.data.y).toBe(pivotPage.qArea.qHeight);
  });

  test('should return correct total row and column count', () => {
    const pivotPage = createPivotPage();
    pivotPage.qArea.qWidth = 1;
    pivotPage.qArea.qHeight = 2;
    const top = [['a', 'b']];
    mockedExtractTop.mockReturnValue(top);
    const left = [['a', 'b']];
    mockedExtractLeft.mockReturnValue(left);

    const data = createData(pivotPage, dimInfo);

    expect(data.size.totalColumns).toBe(2);
    expect(data.size.totalRows).toBe(4);
  });
});
